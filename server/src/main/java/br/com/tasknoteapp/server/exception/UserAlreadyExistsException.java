package br.com.tasknoteapp.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

/** This class represents a User Already Exists request. */
@ResponseStatus(code = HttpStatus.CONFLICT)
public class UserAlreadyExistsException extends ResponseStatusException {
  
  public UserAlreadyExistsException() {
    super(HttpStatus.CONFLICT, "User already exists");
  }
}
