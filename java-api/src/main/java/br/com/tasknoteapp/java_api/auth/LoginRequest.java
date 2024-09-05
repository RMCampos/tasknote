package br.com.tasknoteapp.java_api.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

/** This record represents a login request with user email and password. */
@Schema(description = "Login request with user email and password.")
public record LoginRequest(
    @Schema(description = "User email.") @Email @NotNull String email,
    @Schema(description = "User password.") @NotNull String password) {}
