package br.com.tasknoteapp.java_api.controller;

import br.com.tasknoteapp.java_api.auth.JwtAuthenticationResponse;
import br.com.tasknoteapp.java_api.auth.LoginRequest;
import br.com.tasknoteapp.java_api.exception.UserAlreadyExistsException;
import br.com.tasknoteapp.java_api.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication controller.")
@AllArgsConstructor
public class AuthenticationController {

  private final AuthService authService;

  /**
   * Authenticate a user given his email and password.
   *
   * @param loginRequest User data containing email and password.
   * @return OK if authenticated, 401 - Unauthorized otherwise
   */
  @PostMapping(path = "/signin", consumes = "application/json", produces = "application/json")
  @Operation(
      summary = "SigIn an existing user",
      description = "SigIn an existing user given his email and password",
      responses = {
        @ApiResponse(responseCode = "200", description = "User successfully logged in"),
        @ApiResponse(responseCode = "400", description = "Wrong or missing information"),
      })
  public JwtAuthenticationResponse signin(@RequestBody @Valid LoginRequest loginRequest) {
    String token = authService.signin(loginRequest);
    return new JwtAuthenticationResponse(token);
  }

  /**
   * Signup a new user.
   *
   * @param loginRequest User data with email and password.
   * @return JwtAuthenticationResponse containing user token
   * @throws UserAlreadyExistsException
   */
  @PutMapping(path = "/signup", consumes = "application/json", produces = "application/json")
  @Operation(
      summary = "Signup a new user",
      description = "Signup a new user given his email and password",
      responses = {
        @ApiResponse(responseCode = "201", description = "User successfully created and saved"),
        @ApiResponse(responseCode = "400", description = "Wrong or missing information"),
        @ApiResponse(responseCode = "409", description = "User already exists")
      })
  public ResponseEntity<JwtAuthenticationResponse> signup(
      @RequestBody @Valid LoginRequest loginRequest) {
    String token = authService.create(loginRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(new JwtAuthenticationResponse(token));
  }
}
