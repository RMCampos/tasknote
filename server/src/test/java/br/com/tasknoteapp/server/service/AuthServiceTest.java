package br.com.tasknoteapp.server.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
import br.com.tasknoteapp.server.util.AuthUtil;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class AuthServiceTest {

  @Mock private UserRepository userRepository;

  @Mock private PasswordEncoder passwordEncoder;

  @Mock private JwtService jwtService;

  @Mock private AuthenticationManager authenticationManager;

  @Mock private AuthUtil authUtil;

  @Mock private UserPwdLimitRepository userPwdLimitRepository;

  private AuthService authService;

  @BeforeEach
  void setup() {
    authService =
        new AuthService(
            userRepository,
            passwordEncoder,
            jwtService,
            authenticationManager,
            authUtil,
            userPwdLimitRepository);
  }

  @Test
  @DisplayName("SignUp new user happy path should succeed")
  void signUpNewUser_happyPath_shouldSucceed() {
    LoginRequest request = new LoginRequest("email@domain.com", "123456@abcde!");

    when(userRepository.findByEmail(request.email())).thenReturn(Optional.empty());
    when(authUtil.validatePassword(request.password())).thenReturn(Optional.empty());

    UserEntity entity = new UserEntity();
    entity.setId(3L);
    entity.setEmail(request.email());

    when(userRepository.save(any())).thenReturn(entity);
    when(jwtService.generateToken(request.email())).thenReturn("a1b2c3");

    String token = authService.signUpNewUser(request);

    Assertions.assertNotNull(token);
    Assertions.assertFalse(token.isBlank());
    Assertions.assertEquals("a1b2c3", token);
  }

  @Test
  @DisplayName("SignUp new user with existing email should fail")
  void signUpNewUser_emailExists_shouldFail() {
    LoginRequest request = new LoginRequest("email@domain.com", "123456@abcde!");

    UserEntity existing = new UserEntity();
    when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(existing));

    Assertions.assertThrows(
        UserAlreadyExistsException.class,
        () -> {
          authService.signUpNewUser(request);
        });
  }

  @Test
  @DisplayName("SignUp new user with bad password should fail")
  void signUpNewUser_badPassword_shouldFail() {
    LoginRequest request = new LoginRequest("email@domain.com", "123456");

    when(userRepository.findByEmail(request.email())).thenReturn(Optional.empty());
    when(authUtil.validatePassword(request.password())).thenReturn(Optional.of("Bad password"));

    Assertions.assertThrows(
        BadPasswordException.class,
        () -> {
          authService.signUpNewUser(request);
        });
  }

  @Test
  @DisplayName("Find user by email happy path should succeed")
  void findByEmail_happyPath_shouldSucceed() {
    String email = "user@email.com";

    UserEntity existing = new UserEntity();
    existing.setEmail(email);
    when(userRepository.findByEmail(email)).thenReturn(Optional.of(existing));

    Optional<UserEntity> userOp = authService.findByEmail(email);

    Assertions.assertTrue(userOp.isPresent());
    Assertions.assertEquals(email, userOp.get().getEmail());
  }

  @Test
  @DisplayName("Find user by email not found should succeed")
  void findByEmail_notFound_shouldSucceed() {
    String email = "user@email.com";

    when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

    Optional<UserEntity> userOp = authService.findByEmail(email);

    Assertions.assertTrue(userOp.isEmpty());
  }

  @Test
  @DisplayName("Load user by username happy path should succeed")
  void loadUserByUsername_happyPath_shouldSucceed() {
    String email = "user@domain.com";

    UserEntity existing = new UserEntity();
    existing.setEmail(email);
    existing.setPassword(email + "123");
    when(userRepository.findByEmail(email)).thenReturn(Optional.of(existing));

    User user = authService.loadUserByUsername(email);

    Assertions.assertNotNull(user);
    Assertions.assertEquals(email, user.getUsername());
  }

  @Test
  @DisplayName("Load user by username not found should fail")
  void loadUserByUsername_notFound_shouldFail() {
    String email = "user@domain.com";

    when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

    Assertions.assertThrows(
        UserNotFoundException.class,
        () -> {
          authService.loadUserByUsername(email);
        });
  }

  @Test
  @DisplayName("SignIn user happy path should succeed")
  void signInUser_happyPath_shouldSucceed() {
    LoginRequest request = new LoginRequest("email@domain.com", "123456");

    UserEntity existing = new UserEntity();
    existing.setId(919L);
    existing.setEmail(request.email());
    when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(existing));

    Sort sort = Sort.by(Direction.DESC, "whenHappened");
    when(userPwdLimitRepository.findAllByUser_id(existing.getId(), sort)).thenReturn(List.of());
    when(authenticationManager.authenticate(any())).thenReturn(null);
    when(jwtService.generateToken(request.email())).thenReturn("a1b2c3");

    doNothing().when(userPwdLimitRepository).deleteAllForUser(existing.getId());

    String token = authService.signInUser(request);

    Assertions.assertNotNull(token);
    Assertions.assertEquals("a1b2c3", token);
  }

  @Test
  @DisplayName("SignIn wrong user or password should fail")
  void signInUser_wrongUserOrPassword_shouldFail() {
    LoginRequest request = new LoginRequest("email@domain.com", "123456");

    when(userRepository.findByEmail(request.email())).thenReturn(Optional.empty());

    Assertions.assertThrows(
        WrongUserOrPasswordException.class,
        () -> {
          authService.signInUser(request);
        });
  }

  @Test
  @DisplayName("SignIn max login attempt should fail")
  void signInUser_maxLoginAttempt_shouldFail() {
    LoginRequest request = new LoginRequest("email@domain.com", "123456");

    UserEntity existing = new UserEntity();
    existing.setId(919L);
    when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(existing));

    UserPwdLimitEntity limit1 = new UserPwdLimitEntity();
    limit1.setWhenHappened(LocalDateTime.now().minusMinutes(1));
    UserPwdLimitEntity limit2 = new UserPwdLimitEntity();
    UserPwdLimitEntity limit3 = new UserPwdLimitEntity();
    Sort sort = Sort.by(Direction.DESC, "whenHappened");
    when(userPwdLimitRepository.findAllByUser_id(existing.getId(), sort))
        .thenReturn(List.of(limit1, limit2, limit3));

    Assertions.assertThrows(
        MaxLoginLimitAttemptException.class,
        () -> {
          authService.signInUser(request);
        });
  }

  @Test
  @DisplayName("SignIn bad credentials should fail")
  void signInUser_badCredentials_shouldFail() {
    LoginRequest request = new LoginRequest("email@domain.com", "123456");

    UserEntity existing = new UserEntity();
    existing.setId(919L);
    when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(existing));

    Sort sort = Sort.by(Direction.DESC, "whenHappened");
    when(userPwdLimitRepository.findAllByUser_id(existing.getId(), sort)).thenReturn(List.of());
    when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Wrong"));

    String token = authService.signInUser(request);

    Assertions.assertNull(token);
    verify(userPwdLimitRepository, times(1)).save(any());
  }

  @Test
  @DisplayName("Get all users happy path should succeed")
  void getAllUsers_happyPath_shouldSucceed() {
    String email = "user@domain.com";
    when(authUtil.getCurrentUserEmail()).thenReturn(Optional.of(email));

    UserEntity existing = new UserEntity();
    existing.setId(919L);
    existing.setEmail(email);
    existing.setAdmin(true);
    when(userRepository.findByEmail(email)).thenReturn(Optional.of(existing));

    UserEntity user1 = new UserEntity();
    user1.setEmail("user1@domain.com");
    UserEntity user2 = new UserEntity();
    user2.setEmail("user2@domain.com");
    when(userRepository.findAll()).thenReturn(List.of(user1, user2));

    List<UserResponse> users = authService.getAllUsers();

    Assertions.assertNotNull(users);
    Assertions.assertFalse(users.isEmpty());
    Assertions.assertEquals(user1.getEmail(), users.get(0).email());
    Assertions.assertEquals(user2.getEmail(), users.get(1).email());
  }

  @Test
  @DisplayName("Get all users no current user should fail")
  void getAllUsers_noCurrentUser_shouldFail() {
    when(authUtil.getCurrentUserEmail()).thenReturn(Optional.empty());

    Assertions.assertThrows(UserForbiddenException.class, () -> {
      authService.getAllUsers();
    });
  }

  @Test
  @DisplayName("Get all users user not found should fail")
  void getAllUsers_userNotFound_shouldFail() {
    String email = "user@domain.com";
    when(authUtil.getCurrentUserEmail()).thenReturn(Optional.of(email));
    when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

    Assertions.assertThrows(UserForbiddenException.class, () -> {
      authService.getAllUsers();
    });
  }

  @Test
  @DisplayName("Get all users user not admin should fail")
  void getAllUsers_userNotAdmin_shouldFail() {
    String email = "user@domain.com";
    when(authUtil.getCurrentUserEmail()).thenReturn(Optional.of(email));

    UserEntity existing = new UserEntity();
    existing.setId(919L);
    existing.setEmail(email);
    existing.setAdmin(false);
    when(userRepository.findByEmail(email)).thenReturn(Optional.of(existing));

    Assertions.assertThrows(UserForbiddenException.class, () -> {
      authService.getAllUsers();
    });
  }

  @Test
  @DisplayName("Refresh current user token happy path should succeed")
  void refreshCurrentUserToken_happyPath_shouldSucceed() {
    String email = "user@domain.com";
    when(authUtil.getCurrentUserEmail()).thenReturn(Optional.of(email));

    UserEntity existing = new UserEntity();
    existing.setId(919L);
    existing.setEmail(email);
    existing.setAdmin(false);
    when(userRepository.findByEmail(email)).thenReturn(Optional.of(existing));

    when(jwtService.generateToken(email)).thenReturn("a1b2c3");

    String token = authService.refreshCurrentUserToken();

    Assertions.assertNotNull(token);
    Assertions.assertEquals("a1b2c3", token);
  }

  @Test
  @DisplayName("Delete user account happy path should succeed")
  void deleteUserAccount_happyPath_shouldSucceed() {
    String email = "user@domain.com";
    when(authUtil.getCurrentUserEmail()).thenReturn(Optional.of(email));

    UserEntity existing = new UserEntity();
    existing.setId(919L);
    existing.setEmail(email);
    when(userRepository.findByEmail(email)).thenReturn(Optional.of(existing));
    doNothing().when(userPwdLimitRepository).deleteAllForUser(existing.getId());
    doNothing().when(userRepository).delete(existing);

    UserResponse response = authService.deleteUserAccount();

    Assertions.assertNotNull(response);
  }
}
