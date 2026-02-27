package br.com.tasknoteapp.server.repository;

import br.com.tasknoteapp.server.entity.TaskEntity;
import br.com.tasknoteapp.server.entity.TaskUrlEntity;
import br.com.tasknoteapp.server.entity.UserEntity;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase.Replace;
import org.springframework.test.context.jdbc.Sql;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@Sql(scripts = {"classpath:sql/TaskUrlRepositoryTest.sql"})
class TaskUrlRepositoryIntTest {

  @Autowired TaskUrlRepository taskUrlRepository;

  @Autowired TaskRepository taskRepository;

  @Autowired UserRepository userRepository;

  private static final String USER_EMAIL = "test@domain.com";

  @Test
  @DisplayName("Delete all task url by task id")
  void deleteAllById_taskIdIntTest() {
    Optional<UserEntity> user = userRepository.findByEmail(USER_EMAIL);
    Assertions.assertFalse(user.isEmpty());

    Long userId = user.get().getId();
    List<TaskEntity> tasks = taskRepository.findAllByUser_id(userId);
    Assertions.assertFalse(tasks.isEmpty());

    Optional<TaskEntity> debianTask =
        tasks.stream().filter(t -> t.getDescription().equals("Install Debian")).findFirst();
    Assertions.assertFalse(debianTask.isEmpty());

    Long taskId = debianTask.get().getId();

    taskUrlRepository.deleteAllById_taskId(taskId);

    List<TaskUrlEntity> taskUrls = taskUrlRepository.findAllById_taskId(taskId);
    Assertions.assertTrue(taskUrls.isEmpty());
  }
}
