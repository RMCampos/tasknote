package br.com.tasknoteapp.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import br.com.tasknoteapp.server.service.AppVersionService;

/** Entrypoint of the Java API service application. */
@SpringBootApplication
public class JavaApiApplication implements ApplicationRunner {

  private static final Logger logger = LoggerFactory.getLogger(JavaApiApplication.class);

  @Autowired
  private AppVersionService appVersionService;

  /**
   * Main method of the application.
   *
   * @param args Additional arguments, if any.
   */
  public static void main(String[] args) {
    SpringApplication.run(JavaApiApplication.class, args);
  }

  @Override
  public void run(ApplicationArguments args) throws Exception {
    logger.info("Task Note API started successfully - Version: {}", appVersionService.getVersion());
  }
}
