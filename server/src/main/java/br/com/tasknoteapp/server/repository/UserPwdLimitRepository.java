package br.com.tasknoteapp.server.repository;

import br.com.tasknoteapp.server.entity.UserPwdLimitEntity;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

/** This interface represents a user password limit repository, for database access. */
public interface UserPwdLimitRepository extends JpaRepository<UserPwdLimitEntity, Long> {

  List<UserPwdLimitEntity> findAllByUser_id(Long userId, Sort sort);

  @Modifying
  @Query("delete UserPwdLimitEntity u where u.user.id = ?1")
  void deleteAllForUser(Long userId);
}
