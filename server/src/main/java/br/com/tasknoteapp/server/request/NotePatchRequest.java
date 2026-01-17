package br.com.tasknoteapp.server.request;

/** This record represents a note patch payload. */
public record NotePatchRequest(String title, String description, String url, String tag) {}
