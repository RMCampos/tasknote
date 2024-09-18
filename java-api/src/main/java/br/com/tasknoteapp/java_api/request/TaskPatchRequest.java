package br.com.tasknoteapp.java_api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/** This record represents a task patch payload. */
@Schema(description = "Task patch payload.")
public record TaskPatchRequest(
    @Schema(description = "Task description. Optional.") String description,
    @Schema(description = "Task done definition. Optional.") Boolean done,
    @Schema(description = "Task urls. Optional.") List<TaskUrlPatchRequest> urls) {}
