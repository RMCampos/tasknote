package br.com.tasknoteapp.java_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

/** This class represents a User Not Authorized request. */
@ResponseStatus(code = HttpStatus.FORBIDDEN)
public class UserForbiddenException extends ResponseStatusException {

  public UserForbiddenException() {
    super(HttpStatus.FORBIDDEN, "User not authorized");
  }
}
