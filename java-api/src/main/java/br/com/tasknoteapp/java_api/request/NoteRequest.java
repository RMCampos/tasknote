package br.com.tasknoteapp.java_api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/** This record represents a note request to be created. */
@Schema(description = "Note request to be created.")
public record NoteRequest(
    @Schema(description = "Note description.") @NotNull String description,
    @Schema(description = "Note urls. Optional.") List<String> urls) {}
