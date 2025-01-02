package br.com.tasknoteapp.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

/** This class represents a User Not Found request. */
@ResponseStatus(code = HttpStatus.UNAUTHORIZED)
public class InvalidCredentialsException extends ResponseStatusException {

  public InvalidCredentialsException() {
    super(HttpStatus.UNAUTHORIZED, "Invalid credentials");
  }
}
