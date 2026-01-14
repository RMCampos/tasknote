package br.com.tasknoteapp.server.service.impl;

import br.com.tasknoteapp.server.entity.UserEntity;
import br.com.tasknoteapp.server.repository.UserRepository;
import br.com.tasknoteapp.server.service.UserService;
import java.util.Optional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

/** This class contains the implementation for the User Service class. */
@Service
class UserServiceImpl implements UserService {

  private final UserRepository userRepository;

  public UserServiceImpl(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetailsService userDetailsService() {
    return new UserDetailsService() {
      @Override
      public UserDetails loadUserByUsername(String email) {
        Optional<UserEntity> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
          throw new RuntimeException("User not found: " + email);
        }

        return user.get();
      }
    };
  }
}
