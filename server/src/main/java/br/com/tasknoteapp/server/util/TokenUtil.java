package br.com.tasknoteapp.server.util;

import java.security.SecureRandom;
import java.util.Base64;

/** This class contains a method to create token for the password reset. */
public class TokenUtil {
  private static final SecureRandom secureRandom = new SecureRandom();
  private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder().withoutPadding();

  /**
   * Generate a token for the user reset his password.
   *
   * @return The encoded token with 24 bytes.
   */
  public String generateToken() {
    // 24 bytes ~ 32 chars length after Base64
    // Base64 encoding expands that by a factor of 4/3.
    // 24 bytes * 4/3 = 32 characters
    byte[] randomBytes = new byte[24];
    secureRandom.nextBytes(randomBytes);
    return base64Encoder.encodeToString(randomBytes);
  }
}
