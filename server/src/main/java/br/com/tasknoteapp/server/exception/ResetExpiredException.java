package br.com.tasknoteapp.server.exception;

/** This class represents a Reset expired request. */
public class ResetExpiredException extends BaseBadRequestException {

  public ResetExpiredException() {
    super("reset", "Expired reset link.");
  }
}
