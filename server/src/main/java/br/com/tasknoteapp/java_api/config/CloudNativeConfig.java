package br.com.tasknoteapp.java_api.config;

import br.com.tasknoteapp.java_api.request.LoginRequest;
import br.com.tasknoteapp.java_api.request.NotePatchRequest;
import br.com.tasknoteapp.java_api.request.NoteRequest;
import br.com.tasknoteapp.java_api.request.NoteUrlPatchRequest;
import br.com.tasknoteapp.java_api.request.TaskPatchRequest;
import br.com.tasknoteapp.java_api.request.TaskRequest;
import br.com.tasknoteapp.java_api.request.TaskUrlPatchRequest;
import br.com.tasknoteapp.java_api.response.JwtAuthenticationResponse;
import br.com.tasknoteapp.java_api.response.NoteResponse;
import br.com.tasknoteapp.java_api.response.NoteUrlResponse;
import br.com.tasknoteapp.java_api.response.SearchResponse;
import br.com.tasknoteapp.java_api.response.SummaryResponse;
import br.com.tasknoteapp.java_api.response.TaskResponse;
import br.com.tasknoteapp.java_api.response.TaskUrlResponse;
import br.com.tasknoteapp.java_api.response.UserResponse;
import org.springframework.aot.hint.annotation.RegisterReflectionForBinding;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportRuntimeHints;

@Configuration
@RegisterReflectionForBinding({
  LoginRequest.class,
  NotePatchRequest.class,
  NoteRequest.class,
  NoteUrlPatchRequest.class,
  TaskPatchRequest.class,
  TaskRequest.class,
  TaskUrlPatchRequest.class,
  JwtAuthenticationResponse.class,
  NoteResponse.class,
  NoteUrlResponse.class,
  SearchResponse.class,
  SummaryResponse.class,
  TaskResponse.class,
  TaskUrlResponse.class,
  UserResponse.class,
  io.jsonwebtoken.Claims.class,
  io.jsonwebtoken.Jwts.class,
  io.jsonwebtoken.impl.security.StandardSecureDigestAlgorithms.class,
})
@ImportRuntimeHints(value = {HttpServletRequestRuntimeHint.class})
public class CloudNativeConfig {}
