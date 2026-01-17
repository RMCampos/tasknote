package br.com.tasknoteapp.server.request;

import jakarta.validation.constraints.NotNull;

/** This record represents a note request to be created. */
public record NoteRequest(
    @NotNull String title, @NotNull String description, String url, String tag) {}
