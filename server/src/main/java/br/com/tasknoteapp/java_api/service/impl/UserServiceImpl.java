package br.com.tasknoteapp.java_api.service.impl;

import br.com.tasknoteapp.java_api.entity.UserEntity;
import br.com.tasknoteapp.java_api.repository.UserRepository;
import br.com.tasknoteapp.java_api.service.UserService;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

/** This class contains the implementation for the User Service class. */
@Service
@RequiredArgsConstructor
class UserServiceImpl implements UserService {

  private final UserRepository userRepository;

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
