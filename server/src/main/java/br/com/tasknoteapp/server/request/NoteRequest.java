package br.com.tasknoteapp.server.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

/** This record represents a note request to be created. */
@Schema(description = "Note request to be created.")
public record NoteRequest(
    @Schema(description = "Note title.") @NotNull String title,
    @Schema(description = "Note description.") @NotNull String description,
    @Schema(description = "Note urls. Optional.") String url,
    @Schema(description = "Note tag, optional.") String tag) {}
