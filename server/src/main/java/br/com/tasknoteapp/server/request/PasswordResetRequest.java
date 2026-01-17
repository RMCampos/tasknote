package br.com.tasknoteapp.server.request;

import jakarta.validation.constraints.NotNull;

/** This record represents the confirmation of the password reset. */
public record PasswordResetRequest(
    @NotNull String token, @NotNull String password, @NotNull String passwordAgain) {}
