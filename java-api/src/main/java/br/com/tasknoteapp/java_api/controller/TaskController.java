package br.com.tasknoteapp.java_api.controller;

import br.com.tasknoteapp.java_api.entity.TaskEntity;
import br.com.tasknoteapp.java_api.request.TaskRequest;
import br.com.tasknoteapp.java_api.response.TaskResponse;
import br.com.tasknoteapp.java_api.service.TaskService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/tasks")
@AllArgsConstructor
public class TaskController {

  private final TaskService taskService;

  @GetMapping
  public String tasks() {
    return "Tasks";
  }

  // https://restfulapi.net/rest-put-vs-post/
  @PutMapping
  public void putTask() {}

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
