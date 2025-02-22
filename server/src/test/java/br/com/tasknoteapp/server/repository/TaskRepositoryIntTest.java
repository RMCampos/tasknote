package br.com.tasknoteapp.server.repository;

import br.com.tasknoteapp.server.entity.TaskEntity;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@Sql(scripts = {"classpath:sql/TaskRepositoryTest.sql"})
@Transactional(propagation = Propagation.NOT_SUPPORTED)
class TaskRepositoryIntTest {

  @Autowired private TaskRepository taskRepository;

  private static final Long USER_ID = 1L;

  @Test
  @DisplayName("Find all tasks by user id")
  void findAllByUser_idIntTest() {
    List<TaskEntity> entities = taskRepository.findAllByUser_id(USER_ID);

    Assertions.assertFalse(entities.isEmpty());
    Assertions.assertEquals(2, entities.size());
    Assertions.assertEquals("Refactor", entities.get(0).getDescription());
    Assertions.assertEquals("Cleanup", entities.get(1).getDescription());
  }

  @Test
  @DisplayName("Find all tasks by search term")
  void findAllBySearchTerm_intTest() {
    List<TaskEntity> entities = taskRepository.findAllBySearchTerm("refactor", USER_ID);

    Assertions.assertFalse(entities.isEmpty());
    Assertions.assertEquals(1, entities.size());
    Assertions.assertEquals("Refactor", entities.get(0).getDescription());
  }
}
