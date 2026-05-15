package br.com.tasknoteapp.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

/** This class represents an Email Not Confirmed exception. */
@ResponseStatus(code = HttpStatus.FORBIDDEN)
public class EmailNotConfirmedException extends ResponseStatusException {
  
  public EmailNotConfirmedException() {
    super(HttpStatus.FORBIDDEN, "Email not confirmed!");
  }
}
