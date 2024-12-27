package br.com.tasknoteapp.server.controller;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.tasknoteapp.server.entity.TaskEntity;
import br.com.tasknoteapp.server.exception.TaskNotFoundException;
import br.com.tasknoteapp.server.request.TaskPatchRequest;
import br.com.tasknoteapp.server.request.TaskRequest;
import br.com.tasknoteapp.server.response.TaskResponse;
import br.com.tasknoteapp.server.response.TaskUrlResponse;
import br.com.tasknoteapp.server.service.TaskService;
import java.time.LocalDateTime;
import java.util.List;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class TaskControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private TaskService taskService;

  @Test
  @DisplayName("Get all tasks with some tasks found should succeed")
  @WithMockUser(username = "user@domain.com", password = "abcde123456A@")
  void getAllTasks_tasksFound_shouldSucceed() throws Exception {
    TaskUrlResponse taskUrl = new TaskUrlResponse(1L, "http://test.com");
    TaskResponse taskResponse =
        new TaskResponse(1L, "Desc", false, true, null, null, "Moments ago", List.of(taskUrl));
    when(taskService.getAllTasks()).thenReturn(List.of(taskResponse));

    mockMvc
        .perform(
            get("/rest/tasks")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(taskResponse.id()))
        .andExpect(jsonPath("$[0].description").value(taskResponse.description()))
        .andExpect(jsonPath("$[0].done", Matchers.is(false)))
        .andExpect(jsonPath("$[0].highPriority", Matchers.is(true)))
        .andExpect(jsonPath("$[0].dueDate", Matchers.nullValue()))
        .andExpect(jsonPath("$[0].dueDateFmt", Matchers.nullValue()))
        .andExpect(jsonPath("$[0].lastUpdate").value("Moments ago"))
        .andExpect(jsonPath("$[0].urls[0].id").value(taskUrl.id()))
        .andExpect(jsonPath("$[0].urls[0].url").value(taskUrl.url()))
        .andReturn();
  }

  @Test
  @DisplayName("Get all tasks with no tasks found should succeed")
  @WithMockUser(username = "user@domain.com", password = "abcde123456A@")
  void getAllTasks_noTasksFound_shouldSucceed() throws Exception {
    when(taskService.getAllTasks()).thenReturn(List.of());

    mockMvc
        .perform(
            get("/rest/tasks")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", Matchers.empty()))
        .andReturn();
  }

  @Test
  @DisplayName("Get all tasks with 403 forbidden request should fail")
  void getAllTasks_forbidden_shouldFail() throws Exception {
    mockMvc
        .perform(
            get("/rest/tasks")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden())
        .andReturn();
  }

  @Test
  @DisplayName("Patch a task via patch request happy path should succeed")
  @WithMockUser(username = "user@domain.com", password = "abcde123456A@")
  void patchTask_happyPath_shouldSucceed() throws Exception {
    Long taskId = 111L;
    TaskPatchRequest patchRequest =
        new TaskPatchRequest("Description patched", false, List.of(), null, true);

    TaskResponse taskResponse =
        new TaskResponse(
            taskId, "Description patched", false, true, null, null, "Moments ago", List.of());
    when(taskService.patchTask(taskId, patchRequest)).thenReturn(taskResponse);

    final String payloadJson =
        """
        {
          "description": "Description patched",
          "done": false,
          "urls": [],
          "highPriority": true
        }
        """;

    mockMvc
        .perform(
            patch("/rest/tasks/{id}", taskId)
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON)
                .content(payloadJson))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(taskId))
        .andExpect(jsonPath("$.description").value(taskResponse.description()))
        .andExpect(jsonPath("$.done").value(taskResponse.done()))
        .andExpect(jsonPath("$.highPriority").value(taskResponse.highPriority()))
        .andExpect(jsonPath("$.dueDate", Matchers.nullValue()))
        .andExpect(jsonPath("$.dueDateFmt", Matchers.nullValue()))
        .andExpect(jsonPath("$.lastUpdate").value("Moments ago"))
        .andExpect(jsonPath("$.urls", Matchers.empty()))
        .andReturn();
  }

  @Test
  @DisplayName("Patch a task via patch request with not found id should fail")
  @WithMockUser(username = "user@domain.com", password = "abcde123456A@")
  void patchTask_notFound_shouldFail() throws Exception {
    Long taskId = 111L;
    TaskPatchRequest patchRequest =
        new TaskPatchRequest("Description patched", false, List.of(), null, true);

    when(taskService.patchTask(taskId, patchRequest)).thenThrow(new TaskNotFoundException());

    final String payloadJson =
        """
        {
          "description": "Description patched",
          "done": false,
          "urls": [],
          "highPriority": true
        }
        """;

    mockMvc
        .perform(
            patch("/rest/tasks/{id}", taskId)
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON)
                .content(payloadJson))
        .andExpect(status().isNotFound())
        .andReturn();
  }

  @Test
  @DisplayName("Patch a task via patch request with 403 forbidden exception")
  void patchTask_forbidden_shouldFail() throws Exception {
    Long taskId = 111L;

    final String payloadJson =
        """
        {
          "description": "Description patched",
          "done": false,
          "urls": [],
          "highPriority": true
        }
        """;

    mockMvc
        .perform(
            patch("/rest/tasks/{id}", taskId)
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON)
                .content(payloadJson))
        .andExpect(status().isForbidden())
        .andReturn();
  }

  @Test
  @DisplayName("Post create task happy path should succeed and return 201")
  @WithMockUser(username = "user@domain.com", password = "abcde123456A@")
  void postTasks_happyPath_shouldSucceed() throws Exception {
    TaskRequest request = new TaskRequest("Test task", List.of(), null, true);

    TaskEntity entity = new TaskEntity();
    entity.setId(222L);
    entity.setDescription(request.description());
    entity.setDone(false);
    entity.setUrls(List.of());
    entity.setLastUpdate(LocalDateTime.now());
    entity.setDueDate(null);
    entity.setHighPriority(request.highPriority());
    when(taskService.createTask(request)).thenReturn(entity);

    final String payloadJson =
        """
        {
          "description": "Test task",
          "done": false,
          "urls": [],
          "highPriority": true
        }
        """;

    mockMvc
        .perform(
            post("/rest/tasks")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON)
                .content(payloadJson))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(entity.getId()))
        .andExpect(jsonPath("$.description").value(request.description()))
        .andExpect(jsonPath("$.done", Matchers.is(false)))
        .andExpect(jsonPath("$.highPriority", Matchers.is(request.highPriority())))
        .andExpect(jsonPath("$.dueDate", Matchers.nullValue()))
        .andExpect(jsonPath("$.dueDateFmt", Matchers.nullValue()))
        .andExpect(jsonPath("$.lastUpdate").value("Moments ago"))
        .andExpect(jsonPath("$.urls", Matchers.empty()))
        .andReturn();
  }

  @Test
  @DisplayName("Post create task with missing information should fail with 400 bad request")
  @WithMockUser(username = "user@domain.com", password = "abcde123456A@")
  void postTasks_missingInformation_shouldFail() throws Exception {
    final String payloadJson =
        """
        {
          "description": ""
        }
        """;

    mockMvc
        .perform(
            post("/rest/tasks")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON)
                .content(payloadJson))
        .andExpect(status().isBadRequest())
        .andReturn();
  }

  @Test
  @DisplayName("Post create task with 403 forbidden request should fail")
  void postTasks_forbidden_shouldFail() throws Exception {
    final String payloadJson =
        """
        {
          "description": "Forbidden"
        }
        """;

    mockMvc
        .perform(
            post("/rest/tasks")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON)
                .content(payloadJson))
        .andExpect(status().isForbidden())
        .andReturn();
  }

  @Test
  @DisplayName("Delete task request happy path should succeed")
  @WithMockUser(username = "user@domain.com", password = "abcde123456A@")
  void deleteTask_happyPath_shouldSucceed() throws Exception {
    final Long taskId = 333L;

    doNothing().when(taskService).deleteTask(taskId);

    mockMvc
        .perform(
            delete("/rest/tasks/{id}", taskId)
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent())
        .andReturn();
  }

  @Test
  @DisplayName("Delete task with 403 request forbidden should fail")
  void deleteTask_forbidden_shouldFail() throws Exception {
    final Long taskId = 533L;

    mockMvc
        .perform(
            delete("/rest/tasks/{id}", taskId)
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden())
        .andReturn();
  }

  @Test
  @DisplayName("Delete task with 404 request not found should fail")
  @WithMockUser(username = "user@domain.com", password = "abcde123456A@")
  void deleteTask_notFound_shouldFail() throws Exception {
    final Long taskId = 433L;

    doThrow(new TaskNotFoundException()).when(taskService).deleteTask(taskId);

    mockMvc
        .perform(
            delete("/rest/tasks/{id}", taskId)
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andReturn();
  }
}
