package br.com.tasknoteapp.server.controller;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.tasknoteapp.server.response.UserResponse;
import br.com.tasknoteapp.server.service.AuthService;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private AuthService authService;

  @Test
  @DisplayName("Get all users happy path should succeed")
  @WithMockUser(username = "user@domain.com", password = "abcde123456A@")
  void getAllUsers_happyPath_shouldSucceed() throws Exception {
    UserResponse userResponse = new UserResponse(1L, "email@test.com", false, null, null);
    when(authService.getAllUsers()).thenReturn(List.of(userResponse));

    mockMvc
        .perform(
            get("/rest/users")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].userId").value(userResponse.userId()))
        .andExpect(jsonPath("$[0].email").value(userResponse.email()))
        .andExpect(jsonPath("$[0].admin").value(userResponse.admin()))
        .andReturn();
  }

  @Test
  @DisplayName("Get all users with 403 forbidden request should fail")
  void getAllUsers_forbidden_shouldFail() throws Exception {
    mockMvc
        .perform(
            get("/rest/users")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden())
        .andReturn();
  }
}
