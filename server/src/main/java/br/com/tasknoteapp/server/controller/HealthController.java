package br.com.tasknoteapp.server.controller;

import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tasknoteapp.server.service.AppVersionService;

/** Controller to handle health check requests. */
@RestController
public class HealthController {

  @Autowired private DataSource dataSource;

  @Autowired private AppVersionService appVersionService;

  /**
   * Endpoint to check the health of the application and its database connection.
   *
   * @return ResponseEntity containing health status and version information.
   */
  @GetMapping("/health")
  public ResponseEntity<Map<String, Object>> health() {
    Map<String, Object> health = new HashMap<>();
    Map<String, String> dbHealth = checkDatabase();

    health.put("application", "UP");
    health.put("version", appVersionService.getVersion());
    health.put("database", dbHealth);

    boolean isHealthy = "UP".equals(dbHealth.get("status"));
    HttpStatus status = isHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;

    return ResponseEntity.status(status).body(health);
  }

  private Map<String, String> checkDatabase() {
    Map<String, String> dbHealth = new HashMap<>();
    try (Connection connection = dataSource.getConnection()) {
      if (connection.isValid(2)) {
        dbHealth.put("status", "UP");
      } else {
        dbHealth.put("status", "DOWN");
        dbHealth.put("reason", "Connection invalid");
      }
    } catch (Exception e) {
      dbHealth.put("status", "DOWN");
      dbHealth.put("error", e.getMessage());
    }
    return dbHealth;
  }
}
