package br.com.tasknoteapp.java_api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/** This record represents a note patch payload. */
@Schema(description = "Note patch payload.")
public record NotePatchRequest(
    @Schema(description = "Note title. Optional.") String title,
    @Schema(description = "Note description. Optional.") String description,
    @Schema(description = "Note urls. Optional.") List<NoteUrlPatchRequest> urls) {}
