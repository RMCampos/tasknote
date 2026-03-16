package br.com.tasknoteapp.server.exception;

/** This class represents a bad request when trying to convert to UUID. */
public class BadUuidException extends BaseBadRequestException {

  public BadUuidException() {
    super("uuid", "Bad user identification");
  }
}
