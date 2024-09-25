package br.com.tasknoteapp.java_api.controller;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.tasknoteapp.java_api.config.SecurityConfig;
import br.com.tasknoteapp.java_api.repository.UserRepository;
import br.com.tasknoteapp.java_api.request.LoginRequest;
import br.com.tasknoteapp.java_api.service.AuthService;
import br.com.tasknoteapp.java_api.service.JwtService;
import br.com.tasknoteapp.java_api.service.UserService;
import br.com.tasknoteapp.java_api.util.AuthUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest({AuthenticationController.class, SecurityConfig.class, UserDetailsService.class})
class AuthenticationControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private AuthService authService;

  @MockBean private UserService userService;

  @MockBean private UserRepository userRepository;

  @MockBean private PasswordEncoder passwordEncoder;

  @MockBean private JwtService jwtService;

  @MockBean private AuthenticationManager authenticationManager;

  @MockBean private AuthUtil authUtil;

  @Test
  @DisplayName("Signup happy path should succeed")
  void signup_happyPath_shouldSucceed() throws Exception {
    LoginRequest request = new LoginRequest("user@domain.com", "abcde123456");
    final String token = "xaxbxcxdx1x2x3";

    when(authService.create(request)).thenReturn(token);

    String jsonString =
        """
        {
          "email": "user@domain.com",
          "password": "abcde123456"
        }
        """;

    mockMvc
        .perform(
            put("/auth/signup")
                //.with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                //.accept(MediaType.APPLICATION_JSON)
                .content(jsonString))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.token").value(token))
        .andReturn();
  }
}
