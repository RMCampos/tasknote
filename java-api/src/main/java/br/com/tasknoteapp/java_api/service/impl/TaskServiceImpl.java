package br.com.tasknoteapp.java_api.service.impl;

import br.com.tasknoteapp.java_api.entity.TaskEntity;
import br.com.tasknoteapp.java_api.entity.UserEntity;
import br.com.tasknoteapp.java_api.repository.TaskRepository;
import br.com.tasknoteapp.java_api.request.TaskRequest;
import br.com.tasknoteapp.java_api.response.TaskResponse;
import br.com.tasknoteapp.java_api.service.AuthService;
import br.com.tasknoteapp.java_api.service.TaskService;
import br.com.tasknoteapp.java_api.util.AuthUtil;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
class TaskServiceImpl implements TaskService {

  private final TaskRepository taskRepository;

  private final AuthService authService;

  private final AuthUtil authUtil;

  @Override
  public List<TaskResponse> getAllTasks(Long userId) {
    log.info("Get all tasks to user {}", userId);

    List<TaskEntity> tasks = taskRepository.findAllByUserId(userId);
    log.info("{} tasks found!", tasks.size());

    return tasks.stream().map(TaskResponse::fromEntity).toList();
  }

  @Override
  public TaskEntity createTask(TaskRequest taskRequest) {
    log.info("Creating task {}", taskRequest);

    // get user
    Optional<String> currentUserEmail = authUtil.getCurrentUserEmail();
    String email = currentUserEmail.orElseThrow();

    UserEntity user = authService.findByEmail(email).orElseThrow();

    // create task

    TaskEntity task = new TaskEntity();
    task.setDescription(taskRequest.description());
    task.setDone(false);
    task.setUser(user);
    TaskEntity created = taskRepository.save(task);

    log.info("Task created! Id {}", created.getId());
    return created;
  }

  @Override
  public void updateTask(TaskRequest taskRequest) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'updateTask'");
  }

  @Override
  public void updateTaskDone(Long taskId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'updateTaskDone'");
  }

  @Override
  public void deleteTask(Long taskId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'deleteTask'");
  }
}
