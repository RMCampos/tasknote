package br.com.tasknoteapp.server.repository;

import br.com.tasknoteapp.server.entity.TaskUrlEntity;
import br.com.tasknoteapp.server.entity.TaskUrlEntityPk;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/** This interface represents a task url repository, for database access. */
public interface TaskUrlRepository extends JpaRepository<TaskUrlEntity, TaskUrlEntityPk> {

  void deleteAllById_taskId(Long taskId);

  List<TaskUrlEntity> findAllById_taskId(Long taskId);
}
