package br.com.tasknoteapp.java_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.CONFLICT)
public class UserAlreadyExistsException extends ResponseStatusException {
  
  public UserAlreadyExistsException() {
    super(HttpStatus.CONFLICT, "User already exists");
  }
}
