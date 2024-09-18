package br.com.tasknoteapp.java_api.service.impl;

import br.com.tasknoteapp.java_api.entity.TaskEntity;
import br.com.tasknoteapp.java_api.entity.TaskUrlEntity;
import br.com.tasknoteapp.java_api.entity.UserEntity;
import br.com.tasknoteapp.java_api.exception.TaskNotFoundException;
import br.com.tasknoteapp.java_api.repository.TaskRepository;
import br.com.tasknoteapp.java_api.repository.TaskUrlRepository;
import br.com.tasknoteapp.java_api.request.TaskPatchRequest;
import br.com.tasknoteapp.java_api.request.TaskRequest;
import br.com.tasknoteapp.java_api.request.TaskUrlPatchRequest;
import br.com.tasknoteapp.java_api.response.TaskResponse;
import br.com.tasknoteapp.java_api.service.AuthService;
import br.com.tasknoteapp.java_api.service.TaskService;
import br.com.tasknoteapp.java_api.util.AuthUtil;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/** This class contains the implementation for the Task Service class. */
@Slf4j
@Service
@AllArgsConstructor
class TaskServiceImpl implements TaskService {

  private final TaskRepository taskRepository;

  private final AuthService authService;

  private final AuthUtil authUtil;

  private final TaskUrlRepository taskUrlRepository;

  @Override
  public List<TaskResponse> getAllTasks() {
    UserEntity user = getCurrentUser();

    log.info("Get all tasks to user {}", user.getId());

    List<TaskEntity> tasks = taskRepository.findAllByUser_id(user.getId());
    log.info("{} tasks found!", tasks.size());

    return tasks.stream().map(TaskResponse::fromEntity).toList();
  }

  @Override
  public TaskEntity createTask(TaskRequest taskRequest) {
    UserEntity user = getCurrentUser();

    log.info("Creating task to user {}", user.getId());

    TaskEntity task = new TaskEntity();
    task.setDescription(taskRequest.description());
    task.setDone(false);
    task.setUser(user);
    TaskEntity created = taskRepository.save(task);

    if (Objects.isNull(taskRequest.urls())) {
      List<TaskUrlEntity> urls = saveUrls(task, taskRequest.urls());
      task.setUrls(urls);
    }

    log.info("Task created! Id {}", created.getId());
    return created;
  }

  @Transactional
  @Override
  public TaskResponse patchTask(Long taskId, TaskPatchRequest patch) {
    UserEntity user = getCurrentUser();

    log.info("Patching task {} to user {}", taskId, user.getId());

    Optional<TaskEntity> task = taskRepository.findById(taskId);
    if (task.isEmpty()) {
      throw new TaskNotFoundException();
    }

    TaskEntity taskEntity = task.get();
    if (!Objects.isNull(patch.description()) && !patch.description().isBlank()) {
      taskEntity.setDescription(patch.description());
    }
    if (!Objects.isNull(patch.done())) {
      taskEntity.setDone(patch.done());
    }

    if (!Objects.isNull(patch.urls())) {
      List<Long> urlIds =
          patch.urls().stream().filter(p -> p.id() != null).map(TaskUrlPatchRequest::id).toList();
      if (!urlIds.isEmpty()) {
        taskUrlRepository.deleteAllByIdIn(urlIds);
        log.info("Deleted {} urls from task {}", urlIds.size(), taskId);
      } else {
        log.info("No urls to patch for task {}", taskId);
      }

      List<String> urlsList =
          patch.urls().stream().filter(p -> p.id() == null).map(TaskUrlPatchRequest::url).toList();
      List<TaskUrlEntity> urls = saveUrls(taskEntity, urlsList);

      taskEntity.setUrls(urls);
    }

    TaskEntity patchedTask = taskRepository.save(taskEntity);

    log.info("Task patched! Id {}", patchedTask.getId());

    return TaskResponse.fromEntity(patchedTask);
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

  private UserEntity getCurrentUser() {
    Optional<String> currentUserEmail = authUtil.getCurrentUserEmail();
    String email = currentUserEmail.orElseThrow();
    return authService.findByEmail(email).orElseThrow();
  }

  private List<TaskUrlEntity> saveUrls(TaskEntity taskEntity, List<String> urls) {
    List<TaskUrlEntity> tasksUrl = new ArrayList<>();
    for (String url : urls) {
      TaskUrlEntity taskUrl = new TaskUrlEntity();
      taskUrl.setUrl(url);
      taskUrl.setTask(taskEntity);
      tasksUrl.add(taskUrl);
    }

    List<TaskUrlEntity> savedUrls = taskUrlRepository.saveAll(tasksUrl);
    log.info("Saved {} urls to task {}", savedUrls.size(), taskEntity.getId());

    return savedUrls;
  }
}
