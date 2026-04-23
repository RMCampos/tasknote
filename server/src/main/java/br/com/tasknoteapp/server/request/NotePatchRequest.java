package br.com.tasknoteapp.server.request;

import jakarta.validation.constraints.Pattern;

/** This record represents a note patch payload. */
public record NotePatchRequest(
    String title,
    String description,
    @Pattern(
            regexp = "^(https?://.*|#.*)?$",
            message = "URL must start with http://, https:// or #")
        String url,
    String tag) {}
