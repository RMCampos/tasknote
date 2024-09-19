package br.com.tasknoteapp.java_api.service.impl;

import br.com.tasknoteapp.java_api.entity.UserEntity;
import br.com.tasknoteapp.java_api.exception.UserAlreadyExistsException;
import br.com.tasknoteapp.java_api.exception.UserForbiddenException;
import br.com.tasknoteapp.java_api.exception.UserNotFoundException;
import br.com.tasknoteapp.java_api.repository.UserRepository;
import br.com.tasknoteapp.java_api.request.LoginRequest;
import br.com.tasknoteapp.java_api.response.UserResponse;
import br.com.tasknoteapp.java_api.service.AuthService;
import br.com.tasknoteapp.java_api.service.JwtService;
import br.com.tasknoteapp.java_api.util.AuthUtil;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
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

  /**
   * Create a new user in the app.
   *
   * @param login User details with email and password.
   * @return Token
   */
  @Override
  public String create(LoginRequest login) {
    log.info("Creating user! {}", login.email());

    if (findByEmail(login.email()).isPresent()) {
      throw new UserAlreadyExistsException();
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
  public String signin(LoginRequest login) {
    log.info("Signing in user! {}", login.email());

    Optional<UserEntity> user = findByEmail(login.email());
    if (user.isEmpty()) {
      throw new UserNotFoundException();
    }

    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(login.email(), login.password()));

    String token = jwtService.generateToken(user.get().getEmail());

    log.info("User authenticated! Token {}", token);
    return token;
  }

  /**
   * Get all registered users.
   *
   * @return List of UserEntity.
   * @throws UserForbiddenException
   */
  @Override
  public List<UserResponse> getAllUsers() {
    Optional<String> currentUserEmail = authUtil.getCurrentUserEmail();
    String email = currentUserEmail.orElseThrow();
    UserEntity currentUser = findByEmail(email).orElseThrow();

    log.info("Getting all users to user {}", currentUser.getId());

    if (!currentUser.getAdmin()) {
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
}
