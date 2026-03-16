package br.com.tasknoteapp.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

/** This exception represents a resource not found error. */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class BaseNotFoundException extends ResponseStatusException {
  private final String field;

  public BaseNotFoundException(String field, String message) {
    super(HttpStatus.NOT_FOUND, message);
    this.field = field;
  }

  public String getField() {
    return field;
  }
}
