package br.com.tasknoteapp.server.exception;

/** This exception represents an error when sending email messages. */
public class MailServiceException extends BaseServiceUnavailableException {

  public MailServiceException(String error) {
    super("mail", error);
  }
}
