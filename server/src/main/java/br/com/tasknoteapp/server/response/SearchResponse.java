package br.com.tasknoteapp.server.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/** This record represents a Search response with found results. */
@Schema(description = "Represents a Search response with found results")
public record SearchResponse(
    @Schema(description = "List of found tasks.") List<TaskResponse> tasks,
    @Schema(description = "List of found notes.") List<NoteResponse> notes) {}
