package br.com.tasknoteapp.server.request;

import jakarta.validation.constraints.Pattern;
import java.util.List;

/** This record represents a task patch payload. */
public record TaskPatchRequest(
    String description,
    Boolean done,
    List<
            @Pattern(
                regexp = "^(https?://.*|#.*)?$",
                message = "URL must start with http://, https:// or #")
            String>
        urls,
    String dueDate,
    Boolean highPriority,
    String tag) {}
