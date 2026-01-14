package br.com.tasknoteapp.server.controller;

import br.com.tasknoteapp.server.exception.UserNotFoundException;
import br.com.tasknoteapp.server.response.JwtAuthenticationResponse;
import br.com.tasknoteapp.server.response.UserResponse;
import br.com.tasknoteapp.server.service.UserSessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** This class contains resources for handling user sessions. */
@RestController
@RequestMapping("/rest/user-sessions")
@Tag(name = "User Sessions", description = "Resources to handle user sessions.")
public class UserSessionController {

  private final UserSessionService userSessionService;

  public UserSessionController(UserSessionService userSessionService) {
    this.userSessionService = userSessionService;
  }

  /**
   * Refresh an existing user session, generating a new token.
   *
   * @return JwtAuthenticationResponse with token created.
   * @throws UserNotFoundException if user not found
   */
  @GetMapping("/refresh")
  @Operation(
      summary = "Refresh an existing user session",
      description = "Refresh an existing user session, generating a new token",
      responses = {
        @ApiResponse(responseCode = "200", description = "Session successfully refreshed"),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public JwtAuthenticationResponse refresh() {
    return userSessionService.refreshUserSession();
  }

  /**
   * Delete all the user data and information from the server.
   *
   * @returns {@link UserResponse} with the user information.
   */
  @DeleteMapping("/delete-account")
  @Operation(
      summary = "Delete the user account.",
      description = "Delete all the user data and information from the server.",
      responses = {
        @ApiResponse(responseCode = "200", description = "Account successfully deleted"),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public ResponseEntity<UserResponse> deleteAccount() {
    UserResponse deleted = userSessionService.deleteCurrentUserAccount();
    return ResponseEntity.ok(deleted);
  }
}
