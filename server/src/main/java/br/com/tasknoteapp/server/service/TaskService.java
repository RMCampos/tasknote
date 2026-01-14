package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.entity.TaskEntity;
import br.com.tasknoteapp.server.entity.TaskUrlEntity;
import br.com.tasknoteapp.server.entity.TaskUrlEntityPk;
import br.com.tasknoteapp.server.entity.UserEntity;
import br.com.tasknoteapp.server.exception.TaskNotFoundException;
import br.com.tasknoteapp.server.repository.TaskRepository;
import br.com.tasknoteapp.server.repository.TaskUrlRepository;
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
import java.util.logging.Logger;
import org.springframework.stereotype.Service;

/** This class contains the implementation for the Task Service class. */
@Service
public class TaskService {

  private static final Logger logger = Logger.getLogger(TaskService.class.getName());

  private final TaskRepository taskRepository;

  private final AuthService authService;

  private final AuthUtil authUtil;

  private final TaskUrlRepository taskUrlRepository;

  /**
   * Constructor for the TaskService class.
   *
   * @param taskRepository The repository for task entities.
   * @param authService The service for authentication.
   * @param authUtil Utility class for authentication-related operations.
   * @param taskUrlRepository The repository for task URL entities.
   */
  public TaskService(
      TaskRepository taskRepository,
      AuthService authService,
      AuthUtil authUtil,
      TaskUrlRepository taskUrlRepository) {
    this.taskRepository = taskRepository;
    this.authService = authService;
    this.authUtil = authUtil;
    this.taskUrlRepository = taskUrlRepository;
  }

  /**
   * Get all tasks for the current user.
   *
   * @return {@link List} of {@link TaskResponse} with all Tasks found or an empty list.
   */
  public List<TaskResponse> getAllTasks() {
    UserEntity user = getCurrentUser();
    logger.info("Get all tasks to user " + user.getId());

    List<TaskEntity> tasks = taskRepository.findAllByUser_id(user.getId());
    logger.info(tasks.size() + " tasks found!");

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
    logger.info("Get task " + taskId + " to user " + user.getId());

    Optional<TaskEntity> task = taskRepository.findById(taskId);
    if (task.isEmpty()) {
      throw new TaskNotFoundException();
    }

    logger.info("Task found! Id " + taskId);
    return TaskResponse.fromEntity(task.get(), getAllTasksUrls(taskId));
  }

  /**
   * Create a task for the user in the database.
   *
   * @param taskRequest The {@link TaskRequest} containing all task data.
   */
  public TaskResponse createTask(TaskRequest taskRequest) {
    UserEntity user = getCurrentUser();

    logger.info("Creating task to user " + user.getId());

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

    logger.info("Task created! Id " + created.getId());
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

    logger.info("Patching task " + taskId + " to user " + user.getId());

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

    logger.info("Task patched! Id " + patchedTask.getId());

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

    logger.info("Deleting task " + taskId + " to user " + user.getId());

    Optional<TaskEntity> task = taskRepository.findById(taskId);
    if (task.isEmpty()) {
      throw new TaskNotFoundException();
    }

    List<TaskUrlEntity> urlsToDelete = taskUrlRepository.findAllById_taskId(taskId);
    if (!urlsToDelete.isEmpty()) {
      taskUrlRepository.deleteAllById_taskId(taskId);
      logger.info("Deleted " + urlsToDelete.size() + " urls from task " + taskId);
    } else {
      logger.info("No urls to delete for task " + taskId);
    }

    taskRepository.delete(task.get());

    logger.info("Task deleted! Id " + taskId);
  }

  /**
   * Search for tasks in the database given a search term.
   *
   * @param searchTerm The term to be used for the search.
   * @return {@link List} of {@link TaskResponse} with found records or an empty list.
   */
  public List<TaskResponse> searchTasks(String searchTerm) {
    UserEntity user = getCurrentUser();

    logger.info("Searching tasks to user " + user.getId());

    if (Objects.isNull(searchTerm) || searchTerm.isBlank()) {
      return List.of();
    }

    List<TaskEntity> tasks =
        taskRepository.findAllBySearchTerm(searchTerm.toUpperCase(), user.getId());
    logger.info(tasks.size() + " tasks found!");

    return tasks.stream()
        .map((TaskEntity tr) -> TaskResponse.fromEntity(tr, getAllTasksUrls(tr.getId())))
        .toList();
  }

  /**
   * Get tasks by a given filter.
   *
   * @param filter The filter to get the tasks.
   * @return {@link List} of {@link TaskResponse} with found records or an empty list.
   */
  public List<TaskResponse> getTasksByFilter(String filter) {
    UserEntity user = getCurrentUser();

    List<TaskEntity> allTasks =
        taskRepository.findAllByUser_id(user.getId()).stream()
            .filter(t -> t.getDone().equals(Boolean.FALSE))
            .toList();
    if (allTasks.isEmpty()) {
      return List.of();
    }

    if (filter.equals("all")) {
      return allTasks.stream()
          .map((TaskEntity tr) -> TaskResponse.fromEntity(tr, getAllTasksUrls(tr.getId())))
          .toList();
    }

    if (filter.equals("high")) {
      return allTasks.stream()
          .filter(TaskEntity::getHighPriority)
          .map((TaskEntity tr) -> TaskResponse.fromEntity(tr, getAllTasksUrls(tr.getId())))
          .toList();
    }

    if (filter.equals("untagged")) {
      return allTasks.stream()
          .filter(t -> t.getTag() == null || t.getTag().isBlank())
          .map((TaskEntity tr) -> TaskResponse.fromEntity(tr, getAllTasksUrls(tr.getId())))
          .toList();
    }

    return allTasks.stream()
        .filter(t -> t.getTag().equals(filter))
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
    logger.info("Added " + tasksUrl.size() + " urls from task " + taskEntity.getId());
  }

  private void patchDueDate(TaskEntity taskEntity, TaskPatchRequest patch) {
    taskEntity.setDueDate(null);
    if (!Objects.isNull(patch.dueDate()) && !patch.description().isBlank()) {
      try {
        taskEntity.setDueDate(LocalDate.parse(patch.dueDate()));
      } catch (DateTimeParseException e) {
        logger.severe(
            "Unable to parse the provided date: " + patch.dueDate() + ": " + e.getMessage());
      }
    }
  }

  private void patchTaskUrl(TaskEntity taskEntity, TaskPatchRequest patch) {
    Long taskId = taskEntity.getId();
    List<TaskUrlEntity> urlsToDelete = taskUrlRepository.findAllById_taskId(taskId);
    if (!urlsToDelete.isEmpty()) {
      taskUrlRepository.deleteAllById_taskId(taskId);
      logger.info("Deleted " + urlsToDelete.size() + " urls from task " + taskId);
    } else {
      logger.info("No urls to delete for task " + taskId);
    }

    if (!Objects.isNull(patch.urls())) {
      List<String> urlListToAdd =
          patch.urls().stream().filter(u -> !u.isBlank()).map(String::trim).toList();
      saveUrls(taskEntity, urlListToAdd);
    } else {
      logger.info("No urls to add for task " + taskId);
    }
  }
}
