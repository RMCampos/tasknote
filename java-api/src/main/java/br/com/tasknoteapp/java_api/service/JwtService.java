package br.com.tasknoteapp.java_api.service;

import java.time.LocalDateTime;
import java.util.Map;
import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {

  public String getEmailFromToken(String token);

  public LocalDateTime extractExpiration(String token);

  public String generateToken(String username);

  public String createToken(Map<String, Object> claims, String email);

  public boolean isTokenExpired(String token);

  public boolean validateTokenAndUser(String token, UserDetails user);
}
