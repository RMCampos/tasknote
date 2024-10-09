package br.com.tasknoteapp.server.request;

import io.swagger.v3.oas.annotations.media.Schema;

/** This record represents a Task Url payload to be patched. */
@Schema(description = "Represents a Task Url payload to be patched.")
public record TaskUrlPatchRequest(
    @Schema(description = "The identification of the task url in the database") Long id,
    @Schema(description = "The task URL address, if any.") String url) {}
