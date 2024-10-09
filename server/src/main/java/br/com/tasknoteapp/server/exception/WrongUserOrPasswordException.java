package br.com.tasknoteapp.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

/** This class represents a User Not Found request. */
@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class WrongUserOrPasswordException extends ResponseStatusException {

  public WrongUserOrPasswordException() {
    super(HttpStatus.BAD_REQUEST, "Wrong user or password");
  }
}
