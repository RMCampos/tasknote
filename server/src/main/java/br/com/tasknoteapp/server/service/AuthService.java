package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.entity.UserEntity;
import br.com.tasknoteapp.server.entity.UserPwdLimitEntity;
import br.com.tasknoteapp.server.exception.BadPasswordException;
import br.com.tasknoteapp.server.exception.EmailAlreadyExistsException;
import br.com.tasknoteapp.server.exception.InvalidCredentialsException;
import br.com.tasknoteapp.server.exception.MaxLoginLimitAttemptException;
import br.com.tasknoteapp.server.exception.UserForbiddenException;
import br.com.tasknoteapp.server.exception.UserNotFoundException;
import br.com.tasknoteapp.server.repository.UserPwdLimitRepository;
import br.com.tasknoteapp.server.repository.UserRepository;
import br.com.tasknoteapp.server.request.LoginRequest;
import br.com.tasknoteapp.server.request.UserPatchRequest;
import br.com.tasknoteapp.server.response.UserResponse;
import br.com.tasknoteapp.server.response.UserResponseWithToken;
import br.com.tasknoteapp.server.util.AuthUtil;
import jakarta.transaction.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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
public class AuthService {

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
  public UserResponseWithToken signUpNewUser(LoginRequest login) {
    log.info("Signing up new user! {}", login.email());

    if (findByEmail(login.email()).isPresent()) {
      throw new EmailAlreadyExistsException();
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

    String token = jwtService.generateToken(user);

    log.info("User created! ID {}", user.getId());
    return UserResponseWithToken.fromEntity(user, token, getGravatarImageUrl(login.email()));
  }

  /**
   * Find a user by email in the database.
   *
   * @param email The user email.
   * @return Optional of a UserEntity instance.
   */
  public Optional<UserEntity> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  /**
   * Load a user from the database given his email.
   *
   * @param email The user email.
   * @return User with found record.
   */
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
  @Transactional
  public UserResponseWithToken signInUser(LoginRequest login) {
    log.info("Signing in user! {}", login.email());

    Optional<UserEntity> user = findByEmail(login.email());
    if (user.isEmpty()) {
      throw new InvalidCredentialsException();
    }

    checkLoginAttemptLimit(user.get().getId());

    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(login.email(), login.password()));

      String token = jwtService.generateToken(user.get());

      log.info("User authenticated! Token {}", token);

      userPwdLimitRepository.deleteAllForUser(user.get().getId());
      return UserResponseWithToken.fromEntity(
          user.get(), token, getGravatarImageUrl(login.email()));
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
   * Get all registered users. Only allowed for admin users.
   *
   * @return List of UserEntity.
   * @throws UserForbiddenException when the user has no permissions.
   */
  public List<UserResponse> getAllUsers() {
    Optional<String> currentUserEmail = authUtil.getCurrentUserEmail();
    if (currentUserEmail.isEmpty()) {
      log.error("Unable to get current user from the request");
      throw new UserNotFoundException();
    }

    Optional<UserEntity> currentUserOpt = findByEmail(currentUserEmail.get());
    if (currentUserOpt.isEmpty()) {
      log.error("Unable to find user by email with value: {}", currentUserEmail.get());
      throw new UserNotFoundException();
    }

    UserEntity currentUser = currentUserOpt.get();
    if (!currentUser.getAdmin()) {
      log.warn("User {} not allowed to list users.", currentUser.getId());
      throw new UserForbiddenException();
    }

    log.info("Getting all users to user {}", currentUser.getId());

    List<UserEntity> users = userRepository.findAll();
    List<UserResponse> usersResponse = new ArrayList<>(users.size());
    users.forEach(
        u -> usersResponse.add(UserResponse.fromEntity(u, getGravatarImageUrl(u.getEmail()))));
    log.info("{} user(s) found!", usersResponse.size());

    return usersResponse;
  }

  /**
   * Refresh the current user token.
   *
   * @return Token
   */
  public String refreshCurrentUserToken() {
    Optional<String> currentUserEmail = authUtil.getCurrentUserEmail();
    String email = currentUserEmail.orElseThrow();
    UserEntity currentUser = findByEmail(email).orElseThrow();

    log.info("Refreshing current session to user {}", currentUser.getId());

    String token = jwtService.generateToken(currentUser);

    log.info("User refreshed! Token {}", token);
    return token;
  }

  /**
   * Delete current user account.
   *
   * @return {@link UserResponse} with user data.
   */
  public UserResponse deleteUserAccount() {
    Optional<String> currentUserEmail = authUtil.getCurrentUserEmail();
    String email = currentUserEmail.orElseThrow();
    UserEntity currentUser = findByEmail(email).orElseThrow();

    log.info("Deleting account for user {}", currentUser.getId());

    currentUser.setInactivatedAt(LocalDateTime.now());
    userPwdLimitRepository.deleteAllForUser(currentUser.getId());
    userRepository.delete(currentUser);

    return UserResponse.fromEntity(currentUser, getGravatarImageUrl(email));
  }

  /**
   * Patches a user allowing him to update his information.
   *
   * @param patchRequest An instance of {@link UserPatchRequest} with the user data.
   * @return UserResponse containing the updated info.
   */
  @Transactional
  public UserResponse patchUserInfo(UserPatchRequest patchRequest) {
    Optional<String> currentUserEmail = authUtil.getCurrentUserEmail();
    String email = currentUserEmail.orElseThrow();
    UserEntity currentUser = findByEmail(email).orElseThrow();
    boolean shouldUpdate = false;

    if (!Objects.isNull(patchRequest.name()) && !patchRequest.name().isBlank()) {
      currentUser.setName(patchRequest.name().trim());
      shouldUpdate = true;
    }
    if (!Objects.isNull(patchRequest.email()) && !patchRequest.email().isBlank()) {
      currentUser.setEmail(patchRequest.email().trim());
      shouldUpdate = true;
    }

    boolean updatePassword =
        !Objects.isNull(patchRequest.password())
            && !patchRequest.password().isBlank()
            && !Objects.isNull(patchRequest.passwordAgain())
            && !patchRequest.passwordAgain().isBlank();

    if (updatePassword) {
      Optional<String> passwordValidation = authUtil.validatePassword(patchRequest.password());
      if (passwordValidation.isPresent()) {
        throw new BadPasswordException(passwordValidation.get());
      }

      currentUser.setPassword(passwordEncoder.encode(patchRequest.password()));
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      userRepository.save(currentUser);
    }

    return UserResponse.fromEntity(currentUser, getGravatarImageUrl(email));
  }

  private Optional<String> getGravatarImageUrl(String email) {
    email = email.toLowerCase().trim();
    log.info("Current user email: {}", email);

    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hashBytes = digest.digest(email.toLowerCase().getBytes(StandardCharsets.UTF_8));

      StringBuilder hexString = new StringBuilder();
      for (byte b : hashBytes) {
        String hex = Integer.toHexString(0xff & b);
        if (hex.length() == 1) {
          hexString.append('0');
        }
        hexString.append(hex);
      }
      log.debug("Email hashed: {}", hexString);
      return Optional.of(hexString.toString());
    } catch (NoSuchAlgorithmException | NullPointerException e) {
      log.error("NoSuchAlgorithmException or NullPointerException", e.getMessage());
    }
    return Optional.empty();
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
