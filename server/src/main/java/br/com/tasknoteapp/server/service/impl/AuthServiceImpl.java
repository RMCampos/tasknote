package br.com.tasknoteapp.server.service.impl;

import br.com.tasknoteapp.server.entity.UserEntity;
import br.com.tasknoteapp.server.entity.UserPwdLimitEntity;
import br.com.tasknoteapp.server.exception.BadPasswordException;
import br.com.tasknoteapp.server.exception.MaxLoginLimitAttemptException;
import br.com.tasknoteapp.server.exception.UserAlreadyExistsException;
import br.com.tasknoteapp.server.exception.UserForbiddenException;
import br.com.tasknoteapp.server.exception.UserNotFoundException;
import br.com.tasknoteapp.server.exception.WrongUserOrPasswordException;
import br.com.tasknoteapp.server.repository.UserPwdLimitRepository;
import br.com.tasknoteapp.server.repository.UserRepository;
import br.com.tasknoteapp.server.request.LoginRequest;
import br.com.tasknoteapp.server.response.UserResponse;
import br.com.tasknoteapp.server.service.AuthService;
import br.com.tasknoteapp.server.service.JwtService;
import br.com.tasknoteapp.server.util.AuthUtil;
import jakarta.transaction.Transactional;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/** This class contains the implementation for the Auth Service class. */
@Slf4j
@Service
@AllArgsConstructor
class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;

  private final PasswordEncoder passwordEncoder;

  private final JwtService jwtService;

  private final AuthenticationManager authenticationManager;

  private final AuthUtil authUtil;

  private final UserPwdLimitRepository userPwdLimitRepository;

  /**
   * Create a new user in the app.
   *
   * @param login User details with email and password.
   * @return Token
   */
  @Override
  public String signUpNewUser(LoginRequest login) {
    log.info("Signing up new user! {}", login.email());

    if (findByEmail(login.email()).isPresent()) {
      throw new UserAlreadyExistsException();
    }

    Optional<String> passwordValidation = authUtil.validatePassword(login.password());
    if (passwordValidation.isPresent()) {
      throw new BadPasswordException(passwordValidation.get());
    }

    UserEntity user = new UserEntity();
    user.setEmail(login.email());
    user.setPassword(passwordEncoder.encode(login.password()));
    user.setAdmin(login.email().equals("ricardompcampos@gmail.com"));
    user.setCreatedAt(LocalDateTime.now());
    userRepository.save(user);

    String token = jwtService.generateToken(user.getEmail());

    log.info("User created! Token {}", token);
    return token;
  }

  /**
   * Find a user by email in the database.
   *
   * @param email The user email.
   * @return Optional of a UserEntity instance.
   */
  @Override
  public Optional<UserEntity> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  /**
   * Load a user from the database given his email.
   *
   * @param email The user email.
   * @return User with found record.
   */
  @Override
  public User loadUserByUsername(String email) {
    Optional<UserEntity> user = userRepository.findByEmail(email);
    if (user.isEmpty()) {
      throw new UserNotFoundException();
    }

    return new User(user.get().getEmail(), user.get().getPassword(), new ArrayList<>());
  }

  /**
   * SignIn a user given his email and password.
   *
   * @param login User details with email and password.
   * @return Token
   */
  @Override
  @Transactional
  public String signInUser(LoginRequest login) {
    log.info("Signing in user! {}", login.email());

    Optional<UserEntity> user = findByEmail(login.email());
    if (user.isEmpty()) {
      throw new WrongUserOrPasswordException();
    }

    checkLoginAttemptLimit(user.get().getId());

    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(login.email(), login.password()));

      String token = jwtService.generateToken(user.get().getEmail());

      log.info("User authenticated! Token {}", token);

      userPwdLimitRepository.deleteAllForUser(user.get().getId());
      return token;
    } catch (BadCredentialsException e) {
      log.error("BadCredentialsException when logging in user {}", user.get().getId());

      // store attempt
      UserPwdLimitEntity pwdLimit = new UserPwdLimitEntity();
      pwdLimit.setWhenHappened(LocalDateTime.now());
      pwdLimit.setUser(user.get());
      userPwdLimitRepository.save(pwdLimit);

      return null;
    }
  }

  /**
   * Get all registered users.
   *
   * @return List of UserEntity.
   * @throws UserForbiddenException when the user has no permission.
   */
  @Override
  public List<UserResponse> getAllUsers() {
    Optional<String> currentUserEmail = authUtil.getCurrentUserEmail();
    String email = currentUserEmail.orElseThrow();
    UserEntity currentUser = findByEmail(email).orElseThrow();

    log.info("Getting all users to user {}", currentUser.getId());

    if (!currentUser.getAdmin() || !currentUser.getEmail().equals("ricardompcampos@gmail.com")) {
      log.info("User not allowed!");
      throw new UserForbiddenException();
    }

    List<UserEntity> users = userRepository.findAll();
    List<UserResponse> usersResponse = new ArrayList<>();
    for (UserEntity user : users) {
      UserResponse userResponse =
          new UserResponse(
              user.getId(),
              user.getEmail(),
              user.getAdmin(),
              user.getCreatedAt(),
              user.getInactivatedAt());
      usersResponse.add(userResponse);
    }

    log.info("{} Users found!", usersResponse.size());

    return usersResponse;
  }

  /**
   * Refresh the current user token.
   *
   * @return Token
   */
  @Override
  public String refreshCurrentUserToken() {
    Optional<String> currentUserEmail = authUtil.getCurrentUserEmail();
    String email = currentUserEmail.orElseThrow();
    UserEntity currentUser = findByEmail(email).orElseThrow();

    log.info("Refreshing current session to user {}", currentUser.getId());

    String token = jwtService.generateToken(email);

    log.info("User refreshed! Token {}", token);
    return token;
  }

  private void checkLoginAttemptLimit(Long userId) {
    Sort sort = Sort.by(Direction.DESC, "whenHappened");
    List<UserPwdLimitEntity> userPwdList = userPwdLimitRepository.findAllByUser_id(userId, sort);

    log.warn("Login count attempt for user {}: {}", userId, userPwdList.size());

    // if it's more than 3 times in the last 10 minutes, raise timer of 3 hours.
    if (userPwdList.size() >= 3) {
      UserPwdLimitEntity mostRecent = userPwdList.get(0);
      log.warn("Oldest: {}", mostRecent.getWhenHappened());
      Duration duration = Duration.between(mostRecent.getWhenHappened(), LocalDateTime.now());
      if (duration.toMinutes() <= 3L) {
        log.warn("Wait more {}", (3L - duration.toMinutes()));
        throw new MaxLoginLimitAttemptException();
      }
    }
  }
}
