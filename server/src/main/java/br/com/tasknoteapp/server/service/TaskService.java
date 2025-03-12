package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.entity.TaskEntity;
import br.com.tasknoteapp.server.entity.TaskUrlEntity;
import br.com.tasknoteapp.server.entity.TaskUrlEntityPk;
import br.com.tasknoteapp.server.entity.UserEntity;
import br.com.tasknoteapp.server.entity.UserTasksDone;
import br.com.tasknoteapp.server.entity.UserTasksDonePk;
import br.com.tasknoteapp.server.exception.TaskNotFoundException;
import br.com.tasknoteapp.server.repository.TaskRepository;
import br.com.tasknoteapp.server.repository.TaskUrlRepository;
import br.com.tasknoteapp.server.repository.UserTasksDoneRepository;
import br.com.tasknoteapp.server.request.TaskPatchRequest;
import br.com.tasknoteapp.server.request.TaskRequest;
import br.com.tasknoteapp.server.response.TaskResponse;
import br.com.tasknoteapp.server.util.AuthUtil;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
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

  private final UserTasksDoneRepository userTasksDoneRepository;

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

    return tasks.stream()
        .map((TaskEntity tr) -> TaskResponse.fromEntity(tr, getAllTasksUrls(tr.getId())))
        .toList();
  }

  /**
   * Get a task by its id.
   *
   * @param taskId The task id in the database.
   * @return {@link TaskResponse} with the found task or throw a {@link TaskNotFoundException}.
   */
  public TaskResponse getTaskById(Long taskId) {
    UserEntity user = getCurrentUser();
    log.info("Get task {} to user {}", taskId, user.getId());

    Optional<TaskEntity> task = taskRepository.findById(taskId);
    if (task.isEmpty()) {
      throw new TaskNotFoundException();
    }

    log.info("Task found! Id {}", taskId);
    return TaskResponse.fromEntity(task.get(), getAllTasksUrls(taskId));
  }

  /**
   * Create a task for the user in the database.
   *
   * @param taskRequest The {@link TaskRequest} containing all task data.
   */
  public TaskResponse createTask(TaskRequest taskRequest) {
    UserEntity user = getCurrentUser();

    log.info("Creating task to user {}", user.getId());

    TaskEntity task = new TaskEntity();
    task.setDescription(taskRequest.description());
    task.setDone(false);
    task.setUser(user);
    task.setLastUpdate(LocalDateTime.now());
    if (!Objects.isNull(taskRequest.dueDate()) && !taskRequest.dueDate().isBlank()) {
      task.setDueDate(LocalDate.parse(taskRequest.dueDate()));
    }
    task.setHighPriority(taskRequest.highPriority());
    task.setTag(taskRequest.tag().trim().toLowerCase());
    TaskEntity created = taskRepository.save(task);

    if (!Objects.isNull(taskRequest.urls()) && !taskRequest.urls().isEmpty()) {
      saveUrls(task, taskRequest.urls());
    }

    log.info("Task created! Id {}", created.getId());
    return TaskResponse.fromEntity(created, getAllTasksUrls(created.getId()));
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
      taskEntity.setDescription(patch.description().trim());
    }
    if (!Objects.isNull(patch.done())) {
      taskEntity.setDone(patch.done());
    }
    
    patchDueDate(taskEntity, patch);
    
    taskEntity.setHighPriority(false);
    if (!Objects.isNull(patch.highPriority())) {
      taskEntity.setHighPriority(patch.highPriority());
    }
    taskEntity.setTag(null);
    if (!Objects.isNull(patch.tag())) {
      taskEntity.setTag(patch.tag().trim().toLowerCase());
    }

    taskEntity.setLastUpdate(LocalDateTime.now());

    patchTaskUrl(taskEntity, patch);

    TaskEntity patchedTask = taskRepository.save(taskEntity);

    log.info("Task patched! Id {}", patchedTask.getId());

    if (taskEntity.getDone()) {
      UserTasksDone userTasksDone = new UserTasksDone();
      userTasksDone.setId(new UserTasksDonePk(user.getId(), taskEntity.getId()));
      userTasksDone.setDoneDate(LocalDateTime.now());
      userTasksDoneRepository.save(userTasksDone);
      log.info("Task done saved in the history! Id {}", taskEntity.getId());
    } else {
      log.info("Task undone! Id {}", taskEntity.getId());
      Optional<UserTasksDone> userTasksDone =
          userTasksDoneRepository.findById(new UserTasksDonePk(user.getId(), taskEntity.getId()));
      if (userTasksDone.isPresent()) {
        userTasksDoneRepository.delete(userTasksDone.get());
        log.info("Task undone deleted from history! Id {}", taskEntity.getId());
      }
    }

    return TaskResponse.fromEntity(patchedTask, getAllTasksUrls(taskId));
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

    List<TaskUrlEntity> urlsToDelete = taskUrlRepository.findAllById_taskId(taskId);
    if (!urlsToDelete.isEmpty()) {
      taskUrlRepository.deleteAllById_taskId(taskId);
      log.info("Deleted {} urls from task {}", urlsToDelete.size(), taskId);
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
   * @return {@link List} of {@link TaskResponse} with found records or an empty list.
   */
  public List<TaskResponse> searchTasks(String searchTerm) {
    UserEntity user = getCurrentUser();

    log.info("Searching tasks to user {}", user.getId());

    List<TaskEntity> tasks =
        taskRepository.findAllBySearchTerm(searchTerm.toUpperCase(), user.getId());
    log.info("{} tasks found!", tasks.size());

    return tasks.stream()
        .map((TaskEntity tr) -> TaskResponse.fromEntity(tr, getAllTasksUrls(tr.getId())))
        .toList();
  }

  private UserEntity getCurrentUser() {
    Optional<String> currentUserEmail = authUtil.getCurrentUserEmail();
    String email = currentUserEmail.orElseThrow();
    return authService.findByEmail(email).orElseThrow();
  }

  private List<String> getAllTasksUrls(Long taskId) {
    List<TaskUrlEntity> urls = taskUrlRepository.findAllById_taskId(taskId);
    return urls.stream().map(TaskUrlEntity::getId).map(TaskUrlEntityPk::getUrl).toList();
  }

  private void saveUrls(TaskEntity taskEntity, List<String> urls) {
    List<TaskUrlEntity> tasksUrl = new ArrayList<>();
    for (String url : urls) {
      TaskUrlEntity taskUrl = new TaskUrlEntity();
      TaskUrlEntityPk pk = new TaskUrlEntityPk(taskEntity.getId(), url);
      taskUrl.setId(pk);
      tasksUrl.add(taskUrl);
    }

    taskUrlRepository.saveAll(tasksUrl);
    log.info("Added {} urls from task {}", tasksUrl.size(), taskEntity.getId());
  }

  private void patchDueDate(TaskEntity taskEntity, TaskPatchRequest patch) {
    taskEntity.setDueDate(null);
    if (!Objects.isNull(patch.dueDate()) && !patch.description().isBlank()) {
      try {
        taskEntity.setDueDate(LocalDate.parse(patch.dueDate()));
      } catch (DateTimeParseException e) {
        log.error("Unable to parse the provided date: {}: {}", patch.dueDate(), e.getMessage(), e);
      }
    }
  }

  private void patchTaskUrl(TaskEntity taskEntity, TaskPatchRequest patch) {
    Long taskId = taskEntity.getId();
    List<TaskUrlEntity> urlsToDelete = taskUrlRepository.findAllById_taskId(taskId);
    if (!urlsToDelete.isEmpty()) {
      taskUrlRepository.deleteAllById_taskId(taskId);
      log.info("Deleted {} urls from task {}", urlsToDelete.size(), taskId);
    } else {
      log.info("No urls to delete for task {}", taskId);
    }

    if (!Objects.isNull(patch.urls())) {
      List<String> urlListToAdd =
          patch.urls().stream().filter(u -> !u.isBlank()).map(String::trim).toList();
      saveUrls(taskEntity, urlListToAdd);
    } else {
      log.info("No urls to add for task {}", taskId);
    }
  }
}
