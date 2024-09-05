package br.com.tasknoteapp.java_api.repository;

import br.com.tasknoteapp.java_api.entity.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** This interface contains methods to access the user table in the database. */
public interface UserRepository extends JpaRepository<UserEntity, Long> {

  Optional<UserEntity> findByEmail(String email);
}
