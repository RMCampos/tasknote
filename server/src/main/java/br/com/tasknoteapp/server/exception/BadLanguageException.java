package br.com.tasknoteapp.server.exception;

/** This class represents a Bad Language exception. */
public class BadLanguageException extends BaseBadRequestException {

  public BadLanguageException() {
    super("lang", "Invalid language");
  }
}
