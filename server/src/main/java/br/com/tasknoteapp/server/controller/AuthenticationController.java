package br.com.tasknoteapp.server.controller;

import br.com.tasknoteapp.server.exception.InvalidCredentialsException;
import br.com.tasknoteapp.server.exception.EmailAlreadyExistsException;
import br.com.tasknoteapp.server.exception.UserNotFoundException;
import br.com.tasknoteapp.server.request.LoginRequest;
import br.com.tasknoteapp.server.response.UserResponseWithToken;
import br.com.tasknoteapp.server.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Objects;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** This class contains the resources for handling authentication. */
@RestController
@RequestMapping("/auth")
@Tag(
    name = "Authentication",
    description = "Authentication resources to handle user authentication.")
@AllArgsConstructor
public class AuthenticationController {

  private final AuthService authService;

  /**
   * Signup a new user.
   *
   * @param loginRequest User data with email and password.
   * @return JwtAuthenticationResponse containing user token
   * @throws EmailAlreadyExistsException when the provide email is already in use.
   */
  @PutMapping(path = "/sign-up", consumes = "application/json", produces = "application/json")
  @Operation(
      summary = "Signup a new user",
      description = "Signup a new user given his email and password",
      responses = {
        @ApiResponse(responseCode = "201", description = "User successfully created and saved"),
        @ApiResponse(
            responseCode = "400",
            description = "Wrong or missing information",
            content = @Content(schema = @Schema(implementation = Void.class))),
        @ApiResponse(
            responseCode = "409",
            description = "Email already in use",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public ResponseEntity<UserResponseWithToken> signUp(
      @RequestBody @Valid LoginRequest loginRequest) {
      UserResponseWithToken response = authService.signUpNewUser(loginRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  /**
   * Authenticate a user given his email and password.
   *
   * @param loginRequest User data containing email and password.
   * @return JwtAuthenticationResponse with token created.
   * @throws UserNotFoundException if user not or InvalidCredentialsException if credentials are
   *     invalid.
   */
  @PostMapping(path = "/sign-in", consumes = "application/json", produces = "application/json")
  @Operation(
      summary = "SigIn an existing user",
      description = "SigIn an existing user given his email and password",
      responses = {
        @ApiResponse(responseCode = "200", description = "User successfully logged in"),
        @ApiResponse(
            responseCode = "400",
            description = "Wrong or missing information",
            content = @Content(schema = @Schema(implementation = Void.class))),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Invalid credentials",
            content = @Content(schema = @Schema(implementation = Void.class))),
        @ApiResponse(
            responseCode = "404",
            description = "User not found",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public ResponseEntity<UserResponseWithToken> signIn(@RequestBody @Valid LoginRequest loginRequest) {
    UserResponseWithToken response = authService.signInUser(loginRequest);
    if (Objects.isNull(response)) {
      throw new InvalidCredentialsException();
    }
    return ResponseEntity.ok().body(response);
  }
}
