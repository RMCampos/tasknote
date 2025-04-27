package br.com.tasknoteapp.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

/** This class represents a Reset expired request. */
@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class ResetExpiredException extends ResponseStatusException {

  public ResetExpiredException() {
    super(HttpStatus.NOT_FOUND, "Expired reset link.");
  }
}
