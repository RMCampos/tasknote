package br.com.tasknoteapp.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

/** This exception represents a service unavailable error. */
@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class BaseServiceUnavailableException extends ResponseStatusException {

  private final String field;

  public BaseServiceUnavailableException(String field, String reason) {
    super(HttpStatus.SERVICE_UNAVAILABLE, reason);
    this.field = field;
  }

  public String getField() {
    return field;
  }
}
