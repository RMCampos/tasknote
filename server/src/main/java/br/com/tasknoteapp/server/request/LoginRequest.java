package br.com.tasknoteapp.server.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Setter;
import lombok.ToString;

/** This class represents a login request with user email and password. */
@Schema(description = "Login request with user email and password.")
@Setter
@NotNull
@EqualsAndHashCode
@ToString
@AllArgsConstructor
public class LoginRequest {
  @Schema(description = "User email.")
  @Email
  @NotNull
  String email;

  @Schema(description = "User password.")
  @NotNull
  String password;

  public String email() {
    return email.trim().toLowerCase();
  }

  public String password() {
    return password;
  }
}
