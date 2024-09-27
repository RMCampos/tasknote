package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.entity.TaskEntity;
import br.com.tasknoteapp.server.request.TaskPatchRequest;
import br.com.tasknoteapp.server.request.TaskRequest;
import br.com.tasknoteapp.server.response.TaskResponse;
import java.util.List;

/** This interface contains methods for handling user user Tasks. */
public interface TaskService {

  public List<TaskResponse> getAllTasks();

  public TaskEntity createTask(TaskRequest taskRequest);

  public TaskResponse patchTask(Long taskId, TaskPatchRequest taskRequest);

  public void deleteTask(Long taskId);

  public List<TaskResponse> searchTasks(String searchTerm);
}
