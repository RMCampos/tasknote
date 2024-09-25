package br.com.tasknoteapp.java_api.repository;

import br.com.tasknoteapp.java_api.entity.TaskUrlEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskUrlRepository extends JpaRepository<TaskUrlEntity, Long> {

  void deleteAllByIdIn(List<Long> ids);
}
