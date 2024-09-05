package br.com.tasknoteapp.java_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class UserNotFoundException extends ResponseStatusException {
  
  public UserNotFoundException() {
    super(HttpStatus.NOT_FOUND, "User not found");
  }
}
