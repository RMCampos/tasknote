package br.com.tasknoteapp.server.request;

/** This record represents a Task Url payload to be patched. */
public record TaskUrlPatchRequest(Long id, String url) {}
