package br.com.tasknoteapp.server.repository;

import br.com.tasknoteapp.server.entity.UserEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** This interface contains methods to access the user table in the database. */
public interface UserRepository extends JpaRepository<UserEntity, Long> {

  Optional<UserEntity> findByEmail(String email);

  Optional<UserEntity> findByEmailUuid(UUID uuid);

  Optional<UserEntity> findByResetToken(String token);
}
