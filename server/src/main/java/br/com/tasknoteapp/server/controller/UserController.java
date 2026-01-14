package br.com.tasknoteapp.server.controller;

import br.com.tasknoteapp.server.request.UserPatchRequest;
import br.com.tasknoteapp.server.response.UserResponse;
import br.com.tasknoteapp.server.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** This class contains resources for handling users admin requests. */
@RestController
@RequestMapping("/rest/users")
@Tag(name = "Users", description = "Users resources to handle stored users.")
public class UserController {

  private final AuthService authService;

  public UserController(AuthService authService) {
    this.authService = authService;
  }

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
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class))),
      })
  public List<UserResponse> getAllUsers() {
    return authService.getAllUsers();
  }

  @PatchMapping
  @Operation(
      summary = "Patch the user data",
      description = "Patch all user information. Empty fields will not be updated",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "Task successfully patched",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = UserResponse.class))),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class))),
        @ApiResponse(
            responseCode = "404",
            description = "Task not found",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public ResponseEntity<UserResponse> patchUserInfo(
      @io.swagger.v3.oas.annotations.parameters.RequestBody(
              description = "User data to be patched.",
              required = true)
          @RequestBody
          @Valid
          UserPatchRequest taskRequest) {
    UserResponse patched = authService.patchUserInfo(taskRequest);
    return ResponseEntity.ok().body(patched);
  }
}
