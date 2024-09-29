package br.com.tasknoteapp.server.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

/** This class represents a Note Not Found request. */
@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class NoteNotFoundException extends ResponseStatusException {

  public NoteNotFoundException() {
    super(HttpStatus.NOT_FOUND, "Task not found");
  }
}
