package br.com.tasknoteapp.java_api.service;

import br.com.tasknoteapp.java_api.request.TaskRequest;
import br.com.tasknoteapp.java_api.response.TaskResponse;
import java.util.List;

public interface TaskService {

  public List<TaskResponse> getAllTasks(Long userId);

  public void createTask(TaskRequest taskRequest);

  public void updateTask(TaskRequest taskRequest);

  public void updateTaskDone(Long taskId);

  public void deleteTask(Long taskId);
}
