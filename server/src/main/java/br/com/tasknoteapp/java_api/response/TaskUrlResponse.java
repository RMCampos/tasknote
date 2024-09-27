package br.com.tasknoteapp.java_api.response;

import io.swagger.v3.oas.annotations.media.Schema;

/** This record represents a task url object. */
@Schema(description = "This record represents a task url object.")
public record TaskUrlResponse(
    @Schema(description = "Task url id", example = "1") Long id,
    @Schema(description = "Task url link", example = "http://duckduckgo.com") String url) {}
