package br.com.tasknoteapp.server.config;

import java.util.Arrays;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** This class contains configurations for CORS management. */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

  private static final Logger logger = LoggerFactory.getLogger(CorsConfig.class.getName());

  @Value("${cors.allowed-origins}")
  private String[] allowedOrigins;

  /**
   * Add CORS mappings configuration.
   *
   * @param registry CorsRegistry instance.
   */
  @SuppressWarnings("null")
  public void addCorsMappings(@NonNull CorsRegistry registry) {
    if (allowedOrigins != null && allowedOrigins.length > 0) {
      logger.info("CORS policy allowed origins: {}", Arrays.asList(allowedOrigins));

      registry
          .addMapping("/**")
          .allowedOrigins(allowedOrigins)
          .allowCredentials(true)
          .allowedHeaders(
              "X-XSRF-TOKEN",
              "Content-Type",
              "Accept",
              "Authorization",
              "X-Frame-Options",
              "X-XSS-Protection",
              "Content-Security-Policy")
          .allowedMethods("GET", "PUT", "POST", "DELETE", "OPTIONS", "HEAD", "PATCH");
    }
  }
}
