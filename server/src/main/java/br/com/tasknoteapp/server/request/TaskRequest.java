package br.com.tasknoteapp.server.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/** This record represents a task request to be created. */
@Schema(description = "Task request to be created.")
public record TaskRequest(
    @Schema(description = "Task description.") @NotNull String description,
    @Schema(description = "Task urls. Optional.") List<String> urls,
    @Schema(description = "Due date. Optional.") String dueDate,
    @Schema(description = "Define high priority. Optional.") Boolean highPriority) {}
