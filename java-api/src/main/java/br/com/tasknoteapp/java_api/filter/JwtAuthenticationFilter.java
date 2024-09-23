package br.com.tasknoteapp.java_api.filter;

import br.com.tasknoteapp.java_api.service.JwtService;
import br.com.tasknoteapp.java_api.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  @Autowired private UserService userService;

  @Autowired private JwtService jwtService;

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {
    final String authorizationHeader = request.getHeader("Authorization");

    if (Objects.isNull(authorizationHeader) || authorizationHeader.isBlank()) {
      filterChain.doFilter(request, response);
      return;
    }

    String jwtToken = authorizationHeader;
    if (authorizationHeader.startsWith("Bearer ")) {
      jwtToken = authorizationHeader.substring(7);
    }
    String email = jwtService.getEmailFromToken(jwtToken);

    if (!Objects.isNull(email)
        && Objects.isNull(SecurityContextHolder.getContext().getAuthentication())) {
      UserDetails user = userService.userDetailsService().loadUserByUsername(email);

      if (jwtService.validateTokenAndUser(jwtToken, user)) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        UsernamePasswordAuthenticationToken authToken =
            new UsernamePasswordAuthenticationToken(
                user.getUsername(), user.getPassword(), user.getAuthorities());

        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        context.setAuthentication(authToken);
        SecurityContextHolder.setContext(context);
      }
    }

    filterChain.doFilter(request, response);
  }
}
