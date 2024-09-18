package br.com.tasknoteapp.java_api.util;

import java.util.Objects;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AuthUtil {

  public Optional<String> getCurrentUserEmail() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (!Objects.isNull(auth) && auth.isAuthenticated()) {
      Object principal = auth.getPrincipal();
      if (principal instanceof String userEmail) {
        log.info("Auth email: {}", userEmail);
        return Optional.of(userEmail);
      }
    }
    return Optional.empty();
  }
}
