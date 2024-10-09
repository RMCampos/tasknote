package br.com.tasknoteapp.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

/** This class represents a Max login limit exception. */
@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class MaxLoginLimitAttemptException extends ResponseStatusException {

  public MaxLoginLimitAttemptException() {
    super(HttpStatus.BAD_REQUEST, "Max login attempt limit reached. Please wait 30 minutes");
  }
}
