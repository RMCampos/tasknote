package br.com.tasknoteapp.server.hint;

import io.jsonwebtoken.io.DeserializationException;
import io.jsonwebtoken.io.SerializationException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.aot.hint.RuntimeHints;
import org.springframework.aot.hint.RuntimeHintsRegistrar;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportRuntimeHints;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

/**
 * This class creates RuntimeHints for JJWT exceptions to ensure they are available at runtime in
 * native images.
 */
@Configuration
@ImportRuntimeHints(JjwtRuntimeHints.JjwtHintsRegistrar.class)
public class JjwtRuntimeHints {

  static class JjwtHintsRegistrar implements RuntimeHintsRegistrar {
    @Override
    public void registerHints(@NonNull RuntimeHints hints, @Nullable ClassLoader classLoader) {
      // Register JJWT exceptions for reflection
      hints
          .reflection()
          .registerType(SignatureException.class)
          .registerType(SerializationException.class)
          .registerType(DeserializationException.class);
    }
  }
}
