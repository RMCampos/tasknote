package br.com.tasknoteapp.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

/** This class represents a Bad Language exception. */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadLanguageException extends ResponseStatusException {

  public BadLanguageException() {
    super(HttpStatus.BAD_REQUEST, "Invalid language");
  }
}
