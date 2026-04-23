package br.com.tasknoteapp.server.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/** This record represents a note request to be created. */
public record NoteRequest(
    @NotNull String title,
    @NotNull String description,
    @Pattern(
            regexp = "^(https?://.*|#.*)?$",
            message = "URL must start with http://, https:// or #")
        String url,
    String tag) {}
