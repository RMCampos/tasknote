package br.com.tasknoteapp.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

/** This class represents a base exception for bad requests. */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BaseBadRequestException extends ResponseStatusException {
  private final String field;

  public BaseBadRequestException(String field, String message) {
    super(HttpStatus.BAD_REQUEST, message);
    this.field = field;
  }

  public String getField() {
    return field;
  }
}
