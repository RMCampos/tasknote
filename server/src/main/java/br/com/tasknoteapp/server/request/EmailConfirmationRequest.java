package br.com.tasknoteapp.server.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

/** This record represents a confirmation payload. */
@Schema(description = "Confirmation payload for the user to confirm his email account.")
public record EmailConfirmationRequest(
    @Schema(description = "Confirmation token") @NotNull String identification) {}
