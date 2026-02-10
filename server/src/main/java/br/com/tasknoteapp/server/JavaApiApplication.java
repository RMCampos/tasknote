package br.com.tasknoteapp.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** Entrypoint of the Java API service application. */
@SpringBootApplication
public class JavaApiApplication {

  /**
   * Main method of the application.
   *
   * @param args Additional arguments, if any.
   */
  public static void main(String[] args) {
    SpringApplication.run(JavaApiApplication.class, args);
  }
}
