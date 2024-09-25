package br.com.tasknoteapp.java_api.service.impl;

import br.com.tasknoteapp.java_api.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

/** This class contains the implementation for the Jwt Service class. */
@Service
class JwtServiceImpl implements JwtService {

  private final long SECOND = 1000;
  private final long MINUTE = SECOND * 60;
  private final long EXPIRATION_TIME = MINUTE * 30;
  private final SecretKey KEY = Jwts.SIG.HS256.key().build();

  @Override
  public String getEmailFromToken(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  @Override
  public LocalDateTime extractExpiration(String token) {
    Date date = extractClaim(token, Claims::getExpiration);
    return date.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime();
  }

  @Override
  public String generateToken(String username) {
    Map<String, Object> claims = new HashMap<>();
    return createToken(claims, username);
  }

  @Override
  public String createToken(Map<String, Object> claims, String email) {
    return Jwts.builder()
        .issuer("Java-API")
        .subject(email)
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(KEY)
        .compact();
  }

  @Override
  public boolean isTokenExpired(String token) {
    return extractExpiration(token).isBefore(LocalDateTime.now());
  }

  @Override
  public boolean validateTokenAndUser(String token, UserDetails user) {
    final String email = user.getUsername();
    return !isTokenExpired(token) && getEmailFromToken(token).equals(email);
  }

  private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parser().verifyWith(KEY).build().parseSignedClaims(token).getPayload();
  }
}
