package br.com.tasknoteapp.java_api.util;

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
}
