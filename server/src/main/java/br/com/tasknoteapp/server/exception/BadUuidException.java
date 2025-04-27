package br.com.tasknoteapp.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

/** This class represents a bad request when trying to convert to UUID. */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadUuidException extends ResponseStatusException {

  public BadUuidException() {
    super(HttpStatus.BAD_REQUEST, "Bad user identification");
  }
}
