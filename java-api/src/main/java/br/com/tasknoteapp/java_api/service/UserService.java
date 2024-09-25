package br.com.tasknoteapp.java_api.service;

import org.springframework.security.core.userdetails.UserDetailsService;

/** This interface contains methods for handling user details withing Spring Auth. */
public interface UserService {
  UserDetailsService userDetailsService();
}
