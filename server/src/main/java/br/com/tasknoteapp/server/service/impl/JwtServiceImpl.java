package br.com.tasknoteapp.server.service.impl;

import br.com.tasknoteapp.server.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

/** This class contains the implementation for the Jwt Service class. */
@Service
class JwtServiceImpl implements JwtService {

  private static final long SECOND = 1000;
  private static final long MINUTE = SECOND * 60;
  private static final long EXPIRATION_TIME = MINUTE * 30;
  private static final SecretKey KEY = Jwts.SIG.HS256.key().build();

  @Override
  public String getEmailFromToken(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  @Override
  public LocalDateTime extractExpiration(String token) {
    Date date = extractClaim(token, Claims::getExpiration);
    if (!Objects.isNull(date)) {
      return date.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime();
    }
    return null;
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
    LocalDateTime expiration = extractExpiration(token);
    if (expiration != null) {
      return expiration.isBefore(LocalDateTime.now());
    }
    return true;
  }

  @Override
  public boolean validateTokenAndUser(String token, UserDetails user) {
    final String email = user.getUsername();
    return !isTokenExpired(token) && email.equals(getEmailFromToken(token));
  }

  private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Optional<Claims> claims = extractAllClaims(token);
    if (claims.isPresent()) {
      return claimsResolver.apply(claims.get());
    }
    return null;
  }

  private Optional<Claims> extractAllClaims(String token) {
    try {
      return Optional.of(
          Jwts.parser().verifyWith(KEY).build().parseSignedClaims(token).getPayload());
    } catch (MalformedJwtException me) {
      return Optional.empty();
    }
  }
}
