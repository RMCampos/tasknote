package br.com.tasknoteapp.server.service;

import static org.mockito.Mockito.when;

import br.com.tasknoteapp.server.entity.TaskEntity;
import br.com.tasknoteapp.server.entity.UserEntity;
import br.com.tasknoteapp.server.exception.TaskNotFoundException;
import br.com.tasknoteapp.server.repository.TaskRepository;
import br.com.tasknoteapp.server.repository.TaskUrlRepository;
import br.com.tasknoteapp.server.response.TaskResponse;
import br.com.tasknoteapp.server.util.AuthUtil;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TaskServiceTest {

  @Mock TaskRepository taskRepository;

  @Mock AuthService authService;

  @Mock AuthUtil authUtil;

  @Mock TaskUrlRepository taskUrlRepository;

  private static final Long USER_ID = 123L;

  private static final String USER_EMAIL = "test@domain.com";

  private TaskService taskService;

  @BeforeEach
  void setup() {
    taskService = new TaskService(taskRepository, authService, authUtil, taskUrlRepository);
  }

  @Test
  @DisplayName("Get tasks by id happy path should succeed")
  void getTaskById_happyPath_shouldSucceed() {
    when(authUtil.getCurrentUserEmail()).thenReturn(Optional.of(USER_EMAIL));

    UserEntity userEntity = new UserEntity();
    userEntity.setId(USER_ID);
    userEntity.setEmail(USER_EMAIL);
    when(authService.findByEmail(USER_EMAIL)).thenReturn(Optional.of(userEntity));

    Long taskId = 9976L;

    TaskEntity taskEntity = new TaskEntity();
    taskEntity.setId(taskId);
    taskEntity.setDescription("Test task");
    taskEntity.setHighPriority(true);
    taskEntity.setTag("test");
    taskEntity.setUser(userEntity);
    when(taskRepository.findById(taskId)).thenReturn(Optional.of(taskEntity));

    TaskResponse taskResponse = taskService.getTaskById(taskId);

    Assertions.assertNotNull(taskResponse);
    Assertions.assertEquals(taskEntity.getId(), taskResponse.id());
    Assertions.assertEquals(taskEntity.getDescription(), taskResponse.description());
    Assertions.assertEquals(taskEntity.getHighPriority(), taskResponse.highPriority());
    Assertions.assertEquals(taskEntity.getTag(), taskResponse.tag());
  }

  @Test
  @DisplayName("Get tasks by id not found should fail")
  void getTaskById_notFound_shouldFail() {
    when(authUtil.getCurrentUserEmail()).thenReturn(Optional.of(USER_EMAIL));

    UserEntity userEntity = new UserEntity();
    userEntity.setId(USER_ID);
    userEntity.setEmail(USER_EMAIL);
    when(authService.findByEmail(USER_EMAIL)).thenReturn(Optional.of(userEntity));

    Long taskId = 9976L;

    when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

    Assertions.assertThrows(TaskNotFoundException.class, () -> {
      taskService.getTaskById(taskId);
    });
  }
}
