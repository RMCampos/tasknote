package br.com.tasknoteapp.server.config;

import java.util.Arrays;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** This class contains configurations for CORS management. */
@Slf4j
@Configuration
public class CorsConfig implements WebMvcConfigurer {

  @Value("${cors.allowed-origins}")
  private String[] allowedOrigins;

  /**
   * Add CORS mappings configuration.
   * 
   * @param registry CorsRegistry instance.
   */
  public void addCorsMappings(@NonNull CorsRegistry registry) {
    if (allowedOrigins != null && allowedOrigins.length > 0) {
      log.info("CORS policy allowed origins: {}", Arrays.asList(allowedOrigins));

      registry
          .addMapping("/**")
          .allowedOrigins(allowedOrigins)
          .allowCredentials(true)
          .allowedMethods("GET", "PUT", "POST", "DELETE", "OPTIONS", "HEAD", "PATCH");
    }
  }
}
