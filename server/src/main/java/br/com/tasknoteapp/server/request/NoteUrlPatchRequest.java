package br.com.tasknoteapp.server.request;

import io.swagger.v3.oas.annotations.media.Schema;

/** This record represents a Note Url payload to be patched. */
@Schema(description = "Represents a Note Url payload to be patched.")
public record NoteUrlPatchRequest(
    @Schema(description = "The identification of the note url in the database") Long id,
    @Schema(description = "The note URL address, if any.") String url) {}
