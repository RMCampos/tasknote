package br.com.tasknoteapp.java_api.controller;

import br.com.tasknoteapp.java_api.entity.TaskEntity;
import br.com.tasknoteapp.java_api.request.TaskPatchRequest;
import br.com.tasknoteapp.java_api.request.TaskRequest;
import br.com.tasknoteapp.java_api.response.TaskResponse;
import br.com.tasknoteapp.java_api.service.TaskService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/tasks")
@AllArgsConstructor
public class TaskController {

  private final TaskService taskService;

  @GetMapping
  public List<TaskResponse> getAllTasks() {
    return taskService.getAllTasks();
  }

  @PatchMapping("/{id}")
  public ResponseEntity<TaskResponse> putTask(
      @PathVariable Long id, @RequestBody @Valid TaskPatchRequest taskRequest) {
    return ResponseEntity.ok(taskService.patchTask(id, taskRequest));
  }

  // https://restfulapi.net/rest-put-vs-post/
  @PostMapping
  public ResponseEntity<TaskResponse> postTasks(@RequestBody @Valid TaskRequest taskRequest) {
    TaskEntity createdTask = taskService.createTask(taskRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(TaskResponse.fromEntity(createdTask));
  }

  @DeleteMapping
  public String deleteTasks() {
    return "Delete Tasks";
  }
}
