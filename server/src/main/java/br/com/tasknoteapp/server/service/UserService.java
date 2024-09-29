package br.com.tasknoteapp.server.service;

import org.springframework.security.core.userdetails.UserDetailsService;

/** This interface contains methods for handling user details withing Spring Auth. */
public interface UserService {
  UserDetailsService userDetailsService();
}
