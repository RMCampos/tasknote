package br.com.tasknoteapp.server.exception;

/** This class represents a Task Not Found request. */
public class TaskNotFoundException extends BaseNotFoundException {

  public TaskNotFoundException() {
    super("task", "Task not found");
  }
}
