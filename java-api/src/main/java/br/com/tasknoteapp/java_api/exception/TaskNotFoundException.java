package br.com.tasknoteapp.java_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class TaskNotFoundException extends ResponseStatusException {

  public TaskNotFoundException() {
    super(HttpStatus.NOT_FOUND, "Task not found");
  }
}
