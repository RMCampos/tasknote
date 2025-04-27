package br.com.tasknoteapp.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

/** This exception represents an error when hashing. */
@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class BadAlgorithmException extends ResponseStatusException {

  public BadAlgorithmException(String error) {
    super(HttpStatus.SERVICE_UNAVAILABLE, error);
  }
}
