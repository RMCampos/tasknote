package br.com.tasknoteapp.server.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Setter;
import lombok.ToString;

/** This class represents a login request with user email and password. */
@Schema(description = "Resend confirmation request with user email and password.")
@Setter
@NotNull
@EqualsAndHashCode
@ToString
@AllArgsConstructor
public class ResendConfirmationRequest {
  @Schema(description = "User email.")
  @Email
  @NotNull
  String email;

  public String email() {
    return email.trim().toLowerCase();
  }
}
