package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.entity.TaskEntity;
import br.com.tasknoteapp.server.entity.TaskUrlEntity;
import br.com.tasknoteapp.server.entity.UserEntity;
import br.com.tasknoteapp.server.exception.TaskNotFoundException;
import br.com.tasknoteapp.server.repository.TaskRepository;
import br.com.tasknoteapp.server.repository.TaskUrlRepository;
import br.com.tasknoteapp.server.request.TaskPatchRequest;
import br.com.tasknoteapp.server.request.TaskRequest;
import br.com.tasknoteapp.server.request.TaskUrlPatchRequest;
import br.com.tasknoteapp.server.response.TaskResponse;
import br.com.tasknoteapp.server.util.AuthUtil;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
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
public class TaskService {

  private final TaskRepository taskRepository;

  private final AuthService authService;

  private final AuthUtil authUtil;

  private final TaskUrlRepository taskUrlRepository;

  /**
   * Get all tasks for the current user.
   *
   * @return {@link List} of {@link TaskResponse} with all Tasks found or an empty list.
   */
  public List<TaskResponse> getAllTasks() {
    UserEntity user = getCurrentUser();

    log.info("Get all tasks to user {}", user.getId());

    List<TaskEntity> tasks = taskRepository.findAllByUser_id(user.getId());
    log.info("{} tasks found!", tasks.size());

    return tasks.stream().map((TaskEntity tr) -> TaskResponse.fromEntity(tr)).toList();
  }

  /**
   * Create a task for the user in the database.
   *
   * @param taskRequest The {@link TaskRequest} containing all task data.
   * @return {@link TaskEntity} created.
   */
  public TaskEntity createTask(TaskRequest taskRequest) {
    UserEntity user = getCurrentUser();

    log.info("Creating task to user {}", user.getId());

    TaskEntity task = new TaskEntity();
    task.setDescription(taskRequest.description());
    task.setDone(false);
    task.setUser(user);
    task.setLastUpdate(LocalDateTime.now());
    TaskEntity created = taskRepository.save(task);

    if (!Objects.isNull(taskRequest.urls()) && !taskRequest.urls().isEmpty()) {
      List<TaskUrlEntity> urls = saveUrls(task, taskRequest.urls());
      task.setUrls(urls);
    }

    log.info("Task created! Id {}", created.getId());
    return created;
  }

  /**
   * Patch a task for the current user.
   *
   * @param taskId The task id from the database.
   * @param patch An instance of {@link TaskPatchRequest} with the content to be patched.
   * @return {@link TaskResponse} with the updated content.
   */
  @Transactional
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

    taskEntity.setLastUpdate(LocalDateTime.now());

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

  /**
   * Delete a task from the database.
   *
   * @param taskId The task id in the database
   */
  @Transactional
  public void deleteTask(Long taskId) {
    UserEntity user = getCurrentUser();

    log.info("Deleting task {} to user {}", taskId, user.getId());

    Optional<TaskEntity> task = taskRepository.findById(taskId);
    if (task.isEmpty()) {
      throw new TaskNotFoundException();
    }

    List<TaskUrlEntity> urls = task.get().getUrls();
    if (!urls.isEmpty()) {
      taskUrlRepository.deleteAll(urls);
      log.info("Deleted {} urls from task {}", urls.size(), taskId);
    } else {
      log.info("No urls to delete for task {}", taskId);
    }

    taskRepository.delete(task.get());

    log.info("Task deleted! Id {}", taskId);
  }

  /**
   * Search for tasks in the database given a search term.
   *
   * @param searchTerm The term to be used for the search.
   * @return {@link List} of {@link TaskResponse} with ound records or an empty list.
   */
  public List<TaskResponse> searchTasks(String searchTerm) {
    UserEntity user = getCurrentUser();

    log.info("Searching tasks to user {}", user.getId());

    List<TaskEntity> tasks =
        taskRepository.findAllBySearchTerm(searchTerm.toUpperCase(), user.getId());
    log.info("{} tasks found!", tasks.size());

    return tasks.stream().map((TaskEntity tr) -> TaskResponse.fromEntity(tr)).toList();
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
