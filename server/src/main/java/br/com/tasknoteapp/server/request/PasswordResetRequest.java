package br.com.tasknoteapp.server.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

/** This record represents the confirmation of the password reset. */
@Schema(description = "The password request confirmation payload.")
public record PasswordResetRequest(
    @Schema(description = "Reset token") @NotNull String token,
    @Schema(description = "New password") @NotNull String password,
    @Schema(description = "New password again") @NotNull String passwordAgain) {}
