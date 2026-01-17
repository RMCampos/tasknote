package br.com.tasknoteapp.server.request;

/** This record represents a Note Url payload to be patched. */
public record NoteUrlPatchRequest(Long id, String url) {}
