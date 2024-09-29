package br.com.tasknoteapp.server.response;

import io.swagger.v3.oas.annotations.media.Schema;

/** This record represents a note url object. */
@Schema(description = "This record represents a note url object.")
public record NoteUrlResponse(
    @Schema(description = "Note url id", example = "1") Long id,
    @Schema(description = "Note url link", example = "http://duckduckgo.com") String url) {}
