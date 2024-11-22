package br.com.tasknoteapp.server.controller;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.tasknoteapp.server.exception.UserAlreadyExistsException;
import br.com.tasknoteapp.server.request.LoginRequest;
import br.com.tasknoteapp.server.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AuthenticationControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private AuthService authService;

  @Test
  @DisplayName("Sign up happy path should succeed")
  void signup_happyPath_shouldSucceed() throws Exception {
    LoginRequest request = new LoginRequest("user@domain.com", "abcde123456");
    final String token = "xaxbxcxdx1x2x3A@";

    when(authService.signUpNewUser(request)).thenReturn(token);

    String jsonString =
        """
        {
          "email": "user@domain.com",
          "password": "abcde123456"
        }
        """;

    mockMvc
        .perform(
            put("/auth/sign-up")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON)
                .content(jsonString))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.token").value(token))
        .andReturn();
  }

  @Test
  @DisplayName("Sign up bad email request should fail")
  void signup_badEmailRequest_shouldFail() throws Exception {
    LoginRequest request = new LoginRequest("user@domain..com", "abcde123456");
    final String token = "xaxbxcxdx1x2x3@A";

    when(authService.signUpNewUser(request)).thenReturn(token);

    String jsonString =
        """
        {
          "email": "user@domain..com",
          "password": "abcde123456"
        }
        """;

    mockMvc
        .perform(
            put("/auth/sign-up")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON)
                .content(jsonString))
        .andExpect(status().isBadRequest())
        .andReturn();
  }

  @Test
  @DisplayName("Sign up user already exists should fail")
  void signup_userAlreadyExists_shouldFail() throws Exception {
    LoginRequest request = new LoginRequest("user@domain.com", "abcde123456");

    when(authService.signUpNewUser(request)).thenThrow(new UserAlreadyExistsException());

    String jsonString =
        """
        {
          "email": "user@domain..com",
          "password": "abcde123456"
        }
        """;

    mockMvc
        .perform(
            put("/auth/sign-up")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON)
                .content(jsonString))
        .andExpect(status().isBadRequest())
        .andReturn();
  }

  @Test
  @DisplayName("Sign in happy path should succeed")
  void signin_happyPath_shouldSucceed() throws Exception {
    LoginRequest request = new LoginRequest("user@domain.com", "abcde123456");
    final String token = "xaxbxcxdx1x2x3A@";

    when(authService.signInUser(request)).thenReturn(token);

    String jsonString =
        """
        {
          "email": "user@domain.com",
          "password": "abcde123456"
        }
        """;

    mockMvc
        .perform(
            post("/auth/sign-in")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON)
                .content(jsonString))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").value(token))
        .andReturn();
  }

  @Test
  @DisplayName("Sign in wrong password should fail")
  void signIn_wrongPassword_shouldFail() throws Exception {
    LoginRequest request = new LoginRequest("user@domain.com", "abcde123456");

    when(authService.signInUser(request)).thenReturn(null);

    String jsonString =
        """
        {
          "email": "user@domain.com",
          "password": "abcde123456"
        }
        """;

    mockMvc
        .perform(
            post("/auth/sign-in")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON)
                .content(jsonString))
        .andExpect(status().isBadRequest())
        .andReturn();
  }
}
