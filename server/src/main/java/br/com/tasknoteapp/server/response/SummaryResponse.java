package br.com.tasknoteapp.server.response;

import io.swagger.v3.oas.annotations.media.Schema;

/** This record represents a summary response payload object. */
@Schema(description = "Represents a summary response payload object.")
public record SummaryResponse(
    @Schema(description = "The amount of pending tasks") Integer pendingTaskCount,
    @Schema(description = "The amount of done tasks") Integer doneTaskCount,
    @Schema(description = "The amount of notes") Integer notesCount) {}
