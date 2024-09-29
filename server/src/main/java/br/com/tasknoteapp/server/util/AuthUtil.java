package br.com.tasknoteapp.server.util;

import java.util.Objects;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/** This class contains utils methods to handle authentication. */
@Slf4j
@Component
public class AuthUtil {

  /**
   * Get the current user email, from the security context.
   *
   * @return Optional instance containing user email, if found.
   */
  public Optional<String> getCurrentUserEmail() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (!Objects.isNull(auth) && auth.isAuthenticated()) {
      Object principal = auth.getPrincipal();
      if (principal instanceof String userEmail) {
        return Optional.of(userEmail);
      }
    }
    return Optional.empty();
  }

  /**
   * Validate a password. It should have at least 8 characters, 1 uppercase, 1 number and 1 special
   * character.
   *
   * @param plainPassword The password to be validated
   * @return Optional.empty() if valid, Optional containing message otherwise
   */
  public Optional<String> validatePassword(String plainPassword) {
    if (plainPassword.length() < 8) {
      return Optional.of("Password should have at least 8 characters");
    }

    int len = plainPassword.length();
    int upperCount = len - plainPassword.replaceAll("[A-Z]", "").length();
    if (upperCount < 1) {
      return Optional.of("Password should have at least 1 uppercase character");
    }

    int numberCount = len - plainPassword.replaceAll("[0-9]", "").length();
    if (numberCount < 1) {
      return Optional.of("Password should have at least 1 number");
    }

    int specialCount = len - plainPassword.replaceAll("[a-zA-Z0-9]", "").length();
    if (specialCount < 1) {
      return Optional.of("Password should have at least 1 special character");
    }

    return Optional.empty();
  }
}
