package br.com.tasknoteapp.server.controller;

import br.com.tasknoteapp.server.exception.BaseBadRequestException;
import br.com.tasknoteapp.server.exception.BaseNotFoundException;
import br.com.tasknoteapp.server.exception.BaseServiceUnavailableException;
import br.com.tasknoteapp.server.exception.EmailAlreadyExistsException;
import br.com.tasknoteapp.server.exception.InvalidCredentialsException;
import br.com.tasknoteapp.server.exception.UserForbiddenException;
import br.com.tasknoteapp.server.response.ValidationExceptionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** This class provides exceptions handling for requests. */
@RestControllerAdvice
public class RestExceptionController {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ValidationExceptionResponse> handleValidationException(
      MethodArgumentNotValidException ex) {
    return ResponseEntity.badRequest().body(new ValidationExceptionResponse(ex.getFieldErrors()));
  }

  /* 400 - Bad Request */
  @ExceptionHandler(BaseBadRequestException.class)
  ResponseEntity<ValidationExceptionResponse> handleBadRequestException(
      BaseBadRequestException ex) {
    return ResponseEntity.badRequest()
        .body(new ValidationExceptionResponse(ex.getField(), ex.getReason()));
  }

  /* 401 - Unauthorized */
  @ExceptionHandler(InvalidCredentialsException.class)
  ResponseEntity<ValidationExceptionResponse> handleInvalidCredentialsException(
      InvalidCredentialsException ex) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(new ValidationExceptionResponse("access", ex.getReason()));
  }

  /* 403 - Forbidden */
  @ExceptionHandler(UserForbiddenException.class)
  ResponseEntity<ValidationExceptionResponse> handleUserForbiddenException(
      UserForbiddenException ex) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
        .body(new ValidationExceptionResponse("access", ex.getReason()));
  }

  /* 404 - Not Found */
  @ExceptionHandler(BaseNotFoundException.class)
  ResponseEntity<ValidationExceptionResponse> handleNotFoundException(BaseNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(new ValidationExceptionResponse(ex.getField(), ex.getReason()));
  }

  /* 409 - Conflict */
  @ExceptionHandler(EmailAlreadyExistsException.class)
  ResponseEntity<ValidationExceptionResponse> handleEmailAlreadyExistsException(
      EmailAlreadyExistsException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(new ValidationExceptionResponse("email", ex.getReason()));
  }

  /* 503 - Service Unavailable */
  @ExceptionHandler(BaseServiceUnavailableException.class)
  ResponseEntity<ValidationExceptionResponse> handleServiceUnavailableException(
      BaseServiceUnavailableException ex) {
    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
        .body(new ValidationExceptionResponse(ex.getField(), ex.getReason()));
  }
}
