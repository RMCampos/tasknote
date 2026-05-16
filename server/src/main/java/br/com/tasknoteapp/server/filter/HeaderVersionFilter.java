package br.com.tasknoteapp.server.filter;

import br.com.tasknoteapp.server.service.AppVersionService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** This class manages all the requests adding a custom header with the api version. */
@Component
public class HeaderVersionFilter extends OncePerRequestFilter {

  private final AppVersionService appVersionService;

  HeaderVersionFilter(AppVersionService appVersionService) {
    this.appVersionService = appVersionService;
  }

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain)
      throws ServletException, IOException {
    response.setHeader("X-BUILD-INFO", appVersionService.getVersion());
    filterChain.doFilter(request, response);
  }
}
