package br.com.tasknoteapp.server.exception;

/** This class represents a User Not Found request. */
public class UserNotFoundException extends BaseNotFoundException {

  public UserNotFoundException() {
    super("user", "User not found");
  }
}
