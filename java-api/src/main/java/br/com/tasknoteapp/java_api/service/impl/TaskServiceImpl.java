package br.com.tasknoteapp.java_api.service.impl;

import br.com.tasknoteapp.java_api.entity.TaskEntity;
import br.com.tasknoteapp.java_api.repository.TaskRepository;
import br.com.tasknoteapp.java_api.request.TaskRequest;
import br.com.tasknoteapp.java_api.response.TaskResponse;
import br.com.tasknoteapp.java_api.service.TaskService;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
class TaskServiceImpl implements TaskService {

  private final TaskRepository taskRepository;

  @Override
  public List<TaskResponse> getAllTasks(Long userId) {
    log.info("Get all tasks to user {}", userId);

    List<TaskEntity> tasks = taskRepository.findAllByUserId(userId);
    log.info("{} tasks found!", tasks.size());

    return tasks.stream().map(TaskResponse::fromEntity).toList();
  }

  @Override
  public void createTask(TaskRequest taskRequest) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'createTask'");
    // keep going from here
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
