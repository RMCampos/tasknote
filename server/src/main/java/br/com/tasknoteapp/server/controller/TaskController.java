package br.com.tasknoteapp.server.controller;

import br.com.tasknoteapp.server.exception.TaskNotFoundException;
import br.com.tasknoteapp.server.request.TaskPatchRequest;
import br.com.tasknoteapp.server.request.TaskRequest;
import br.com.tasknoteapp.server.response.TaskResponse;
import br.com.tasknoteapp.server.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
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

/** This class contains resources for handling tasks. */
@RestController
@RequestMapping("/rest/tasks")
@Tag(name = "Tasks", description = "Tasks resources to handle user tasks and urls.")
public class TaskController {

  private final TaskService taskService;

  public TaskController(TaskService taskService) {
    this.taskService = taskService;
  }

  /**
   * Get all tasks.
   *
   * @return List of TaskResponse with all found tasks and its urls, if any.
   */
  @GetMapping
  @Operation(
      summary = "Get all tasks",
      description = "Get all tasks for the current user and its urls, if any",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "Return an array containing found Tasks, or empty array otherwise.",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = TaskResponse.class, type = "array"))),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public List<TaskResponse> getAllTasks() {
    return taskService.getAllTasks();
  }

  /**
   * Get a task by its ID.
   *
   * @param id Task identification.
   * @return TaskResponse with task data and its urls, if any.
   * @throws TaskNotFoundException when task not found.
   */
  @GetMapping("/{id}")
  @Operation(
      summary = "Get a task by its ID",
      description = "Get a task by its ID and its urls, if any.",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "Return the found Task and its urls, if any."),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class))),
        @ApiResponse(
            responseCode = "404",
            description = "Task not found",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public TaskResponse getTaskById(
      @Parameter(
              name = "id",
              in = ParameterIn.PATH,
              description = "Task id to be fetched.",
              required = true,
              schema = @Schema(type = "integer", format = "int64"))
          @PathVariable
          Long id) {
    return taskService.getTaskById(id);
  }

  /**
   * Patch a task.
   *
   * @param id The task id to be patched.
   * @param taskRequest Task data to be patched, including optionally its urls.
   * @return TaskResponse containing data that was updated.
   * @throws TaskNotFoundException when task not found.
   */
  @PatchMapping("/{id}")
  @Operation(
      summary = "Patch a task",
      description = "Patch a task and all its urls. Option to patch only the urls.",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "Task successfully patched",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = TaskResponse.class))),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class))),
        @ApiResponse(
            responseCode = "404",
            description = "Task not found",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public ResponseEntity<TaskResponse> patchTask(
      @Parameter(
              name = "id",
              in = ParameterIn.PATH,
              description = "Task id to be patched.",
              required = true,
              schema = @Schema(type = "integer", format = "int64"))
          @PathVariable
          Long id,
      @io.swagger.v3.oas.annotations.parameters.RequestBody(
              description = "Task data to be patched, including optionally its urls.",
              required = true)
          @RequestBody
          @Valid
          TaskPatchRequest taskRequest) {
    return ResponseEntity.ok(taskService.patchTask(id, taskRequest));
  }

  /**
   * Create a task.
   *
   * @param taskRequest Task data to be created, including optionally its urls. Following RESTful
   *     API pattern from https://restfulapi.net/rest-put-vs-post/.
   * @return TaskResponse containing data that was created.
   */
  @PostMapping
  @Operation(
      summary = "Create a task",
      description = "Create a task and all its urls.",
      responses = {
        @ApiResponse(
            responseCode = "201",
            description = "Task successfully crated.",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = TaskResponse.class))),
        @ApiResponse(
            responseCode = "400",
            description = "Wrong or missing information",
            content = @Content(schema = @Schema(implementation = Void.class))),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class))),
      })
  public ResponseEntity<TaskResponse> postTasks(
      @io.swagger.v3.oas.annotations.parameters.RequestBody(
              description = "Task data to be created, including optionally its urls.",
              required = true)
          @RequestBody
          @Valid
          TaskRequest taskRequest) {
    TaskResponse response = taskService.createTask(taskRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  /**
   * Delete a task given its ID.
   *
   * @param id Task identification.
   * @throws TaskNotFoundException when task not found.
   */
  @DeleteMapping("/{id}")
  @Operation(
      summary = "Delete a task",
      description = "Delete a task given its ID.",
      responses = {
        @ApiResponse(
            responseCode = "204",
            description = "Task successfully deleted",
            content = @Content(schema = @Schema(implementation = Void.class))),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class))),
        @ApiResponse(
            responseCode = "404",
            description = "Task not found",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public ResponseEntity<Void> deleteTask(
      @Parameter(
              name = "id",
              in = ParameterIn.PATH,
              description = "Task id to be patched.",
              required = true,
              schema = @Schema(type = "integer", format = "int64"))
          @PathVariable
          Long id) {
    taskService.deleteTask(id);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }
}
