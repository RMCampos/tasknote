package br.com.tasknoteapp.server.response;

/** This record represents a JWT Token response to be returned to the client. */
public record JwtAuthenticationResponse(String token) {}
