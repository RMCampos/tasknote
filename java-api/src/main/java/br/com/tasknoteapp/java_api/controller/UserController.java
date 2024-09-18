package br.com.tasknoteapp.java_api.controller;

import br.com.tasknoteapp.java_api.response.UserResponse;
import br.com.tasknoteapp.java_api.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/users")
@AllArgsConstructor
@Tag(name = "Users", description = "Users resources to handle stored users.")
public class UserController {

  private final AuthService authService;

  /**
   * Get all users.
   *
   * @return List of UserEntity with all found users.
   */
  @GetMapping
  @Operation(
      summary = "Get all users",
      description = "Get all users for the current user",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "Users successfully retrieved",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = UserResponse.class, type = "array"))),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class))),
      })
  public List<UserResponse> getAllUsers() {
    return authService.getAllUsers();
  }
}
