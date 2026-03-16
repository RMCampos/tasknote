package br.com.tasknoteapp.server.exception;

/** This class represents a Bad Password exception. */
public class BadPasswordException extends BaseBadRequestException {

  public BadPasswordException(String message) {
    super("password", String.format("Bad password: %s", message));
  }
}
