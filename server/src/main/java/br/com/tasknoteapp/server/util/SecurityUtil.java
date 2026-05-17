package br.com.tasknoteapp.server.util;

/** This class contains useful methods to handle security routines. */
public class SecurityUtil {

  /**
   * Redacts an email address by replacing the characters before the "@" symbol with "...". If the
   * email is null or blank, it returns the original email. For example, "
   *
   * @param email The email address
   * @return Redacted email address
   */
  public static String redactEmail(String email) {
    if (email == null || email.isBlank()) {
      return email;
    }
    int posAt = email.indexOf("@");
    int halfPos = posAt / 2;
    return email.substring(0, halfPos) + "..." + email.substring(posAt);
  }
}
