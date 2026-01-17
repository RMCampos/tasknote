package br.com.tasknoteapp.server.request;

import java.util.List;

/** This record represents a task patch payload. */
public record TaskPatchRequest(
    String description,
    Boolean done,
    List<String> urls,
    String dueDate,
    Boolean highPriority,
    String tag) {}
