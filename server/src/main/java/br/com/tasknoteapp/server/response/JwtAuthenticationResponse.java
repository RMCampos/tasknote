package br.com.tasknoteapp.server.response;

import io.swagger.v3.oas.annotations.media.Schema;

/** This record represents a JWT Token response to be returned to the client. */
@Schema(description = "Represents a JWT Token response to be returned to the client.")
public record JwtAuthenticationResponse(@Schema(description = "The JWT token") String token) {}
