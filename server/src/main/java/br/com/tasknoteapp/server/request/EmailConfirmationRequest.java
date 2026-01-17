package br.com.tasknoteapp.server.request;

import jakarta.validation.constraints.NotNull;

/** This record represents a confirmation payload. */
public record EmailConfirmationRequest(@NotNull String identification) {}
