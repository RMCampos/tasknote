package br.com.tasknoteapp.server.request;

import io.swagger.v3.oas.annotations.media.Schema;

/** This record represents a note patch payload. */
@Schema(description = "Note patch payload.")
public record NotePatchRequest(
    @Schema(description = "Note title. Optional.") String title,
    @Schema(description = "Note description. Optional.") String description,
    @Schema(description = "Note urls. Optional.") String url) {}
