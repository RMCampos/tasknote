package br.com.tasknoteapp.server.service;

import org.springframework.boot.info.BuildProperties;
import org.springframework.stereotype.Service;

/** Service to retrieve application version information. */
@Service
public class AppVersionService {

  private final BuildProperties buildProperties;

  /**
   * Constructor for AppVersionService.
   *
   * @param buildProperties the build properties injected by Spring Boot
   */
  public AppVersionService(BuildProperties buildProperties) {
    this.buildProperties = buildProperties;
  }

  /**
   * Retrieves the application version combined with the build time.
   *
   * @return a string representing the application version and build time
   */
  public String getVersion() {
    return buildProperties.getVersion() + "-" + buildProperties.getTime();
  }
}
