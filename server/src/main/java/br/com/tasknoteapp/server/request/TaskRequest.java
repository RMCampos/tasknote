package br.com.tasknoteapp.server.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.List;

/** This record represents a task request to be created. */
public record TaskRequest(
    @NotNull @NotEmpty String description,
    List<
            @Pattern(
                regexp = "^(https?://.*|#.*)?$",
                message = "URL must start with http://, https:// or #")
            String>
        urls,
    String dueDate,
    Boolean highPriority,
    String tag) {}
