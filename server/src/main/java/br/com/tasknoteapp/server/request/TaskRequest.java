package br.com.tasknoteapp.server.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/** This record represents a task request to be created. */
public record TaskRequest(
    @NotNull @NotEmpty String description,
    List<String> urls,
    String dueDate,
    Boolean highPriority,
    String tag) {}
