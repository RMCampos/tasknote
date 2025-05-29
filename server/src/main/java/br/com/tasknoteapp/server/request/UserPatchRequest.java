package br.com.tasknoteapp.server.request;

import io.swagger.v3.oas.annotations.media.Schema;

/** This record represents a user patch payload. */
@Schema(description = "User patch payload.")
public record UserPatchRequest(
    @Schema(description = "User first name. Optional.") String name,
    @Schema(description = "User email. Optional.") String email,
    @Schema(description = "User password. Optional.") String password,
    @Schema(description = "User password again. Optional.") String passwordAgain,
    @Schema(description = "User lang. Optional.") String lang) {}
