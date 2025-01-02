package br.com.tasknoteapp.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

/** This class represents an exiting email exception. */
@ResponseStatus(code = HttpStatus.CONFLICT)
public class EmailAlreadyExistsException extends ResponseStatusException {
  
  public EmailAlreadyExistsException() {
    super(HttpStatus.CONFLICT, "Email already exists!");
  }
}
