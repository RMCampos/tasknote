package br.com.tasknoteapp.server.exception;

/** This exception represents an error when hashing. */
public class BadAlgorithmException extends BaseServiceUnavailableException {

  public BadAlgorithmException(String error) {
    super("algorithm", error);
  }
}
