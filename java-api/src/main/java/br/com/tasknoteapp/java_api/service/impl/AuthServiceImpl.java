package br.com.tasknoteapp.java_api.service.impl;

import br.com.tasknoteapp.java_api.entity.UserEntity;
import br.com.tasknoteapp.java_api.exception.UserAlreadyExistsException;
import br.com.tasknoteapp.java_api.exception.UserNotFoundException;
import br.com.tasknoteapp.java_api.repository.UserRepository;
import br.com.tasknoteapp.java_api.request.LoginRequest;
import br.com.tasknoteapp.java_api.service.AuthService;
import br.com.tasknoteapp.java_api.service.JwtService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;

  private final PasswordEncoder passwordEncoder;

  private final JwtService jwtService;

  private final AuthenticationManager authenticationManager;

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
}
