package br.com.tasknoteapp.server.repository;

import br.com.tasknoteapp.server.entity.UserTasksDone;
import br.com.tasknoteapp.server.entity.UserTasksDonePk;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/** This interface contains methods to access the user done tasks table in the database. */
public interface UserTasksDoneRepository extends JpaRepository<UserTasksDone, UserTasksDonePk> {

  List<UserTasksDone> findAllByDoneDateAfterAndId_userId(LocalDateTime date, Long userId);
  
  List<UserTasksDone> findAllById_userId(Long userId);
}
