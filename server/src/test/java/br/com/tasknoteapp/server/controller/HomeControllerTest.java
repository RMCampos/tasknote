package br.com.tasknoteapp.server.controller;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.tasknoteapp.server.response.NoteResponse;
import br.com.tasknoteapp.server.response.SearchResponse;
import br.com.tasknoteapp.server.response.SummaryResponse;
import br.com.tasknoteapp.server.response.TaskResponse;
import br.com.tasknoteapp.server.response.TasksChartResponse;
import br.com.tasknoteapp.server.service.HomeService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class HomeControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private HomeService homeService;

  @Test
  @DisplayName("Get summary happy path should succeed")
  @WithMockUser(username = "user@domain.com", password = "abcde123456A@")
  void getSummary_happyPath_shouldSucceed() throws Exception {
    SummaryResponse response = new SummaryResponse(0, 6, 2);

    when(homeService.getSummary()).thenReturn(response);

    mockMvc
        .perform(
            get("/rest/home/summary")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.pendingTaskCount").value(response.pendingTaskCount()))
        .andExpect(jsonPath("$.doneTaskCount").value(response.doneTaskCount()))
        .andExpect(jsonPath("$.notesCount").value(response.notesCount()))
        .andReturn();
  }

  @Test
  @DisplayName("Get summary user not authorized should fail")
  void getSummary_userNotAuthorized_shouldFail() throws Exception {
    SummaryResponse response = new SummaryResponse(0, 6, 2);

    when(homeService.getSummary()).thenReturn(response);

    mockMvc
        .perform(
            get("/rest/home/summary")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isUnauthorized())
        .andReturn();
  }

  @Test
  @DisplayName("Search happy path should succeed")
  @WithMockUser(username = "user@domain.com", password = "abcde123456A@")
  void search_happyPath_shouldSucceed() throws Exception {
    TaskResponse task =
        new TaskResponse(
            1L, "Task 1", false, true, LocalDate.now(), "2024-11-20", "now", "tag", List.of());
    NoteResponse note = new NoteResponse(1L, "Note 1", "Note desc", null, "tag");
    SearchResponse response = new SearchResponse(List.of(task), List.of(note));

    when(homeService.search("term")).thenReturn(response);

    mockMvc
        .perform(
            get("/rest/home/search?term=term")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.tasks", Matchers.isA(List.class)))
        .andExpect(jsonPath("$.notes", Matchers.isA(List.class)))
        .andExpect(jsonPath("$.tasks[0].id").value(task.id()))
        .andExpect(jsonPath("$.tasks[0].description").value(task.description()))
        .andExpect(jsonPath("$.tasks[0].done").value(task.done()))
        .andExpect(jsonPath("$.tasks[0].urls", Matchers.empty()))
        .andExpect(jsonPath("$.notes[0].id").value(note.id()))
        .andExpect(jsonPath("$.notes[0].title").value(note.title()))
        .andExpect(jsonPath("$.notes[0].description").value(note.description()))
        .andExpect(jsonPath("$.notes[0].url", Matchers.nullValue()))
        .andReturn();
  }

  @Test
  @DisplayName("Get tasks chart data with happy path should succeed")
  @WithMockUser(username = "user@domain.com", password = "abcde123456A@")
  void getTasksChart_happyPath_shouldSucceed() throws Exception {
    TasksChartResponse responseOne = new TasksChartResponse(LocalDateTime.now(), "Thu", 1);
    TasksChartResponse responseTwo = new TasksChartResponse(LocalDateTime.now(), "Fri", 2);

    when(homeService.getTasksChartData()).thenReturn(List.of(responseOne, responseTwo));

    mockMvc
        .perform(
            get("/rest/home/completed-tasks-chart")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].day").value("Thu"))
        .andExpect(jsonPath("$[0].count").value(1))
        .andExpect(jsonPath("$[1].day").value("Fri"))
        .andExpect(jsonPath("$[1].count").value(2))
        .andReturn();
  }

  @Test
  @DisplayName("Get tasks chart data user not authorized should fail")
  void getTasksChart_userNotAuthorized_shouldFail() throws Exception {
    mockMvc
        .perform(
            get("/rest/home/completed-tasks-chart")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isUnauthorized())
        .andReturn();
  }

  @Test
  @DisplayName("Get tasks by filter using the filter all it should succeed")
  @WithMockUser(username = "user@domain.com", password = "abcde123456A@")
  void tasksByFilter_allTasks_shouldSucceed() throws Exception {
    String filter = "all";
    TaskResponse taskResponse =
        new TaskResponse(
            1L, "Desc", false, true, null, null, "Moments ago", "tag", List.of("http://test.com"));
    when(homeService.getTasksByFilter(filter)).thenReturn(List.of(taskResponse));

    mockMvc
        .perform(
            get("/rest/home/tasks/filter/{filter}", filter)
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
        .andExpect(jsonPath("$[0].urls[0]").value(taskResponse.urls().get(0)))
        .andReturn();
  }

  @Test
  @DisplayName("Get tasks by filter not authorized it should fail")
  void tasksByFilter_notAuthorized_shouldFail() throws Exception {
    String filter = "all";

    mockMvc
        .perform(
            get("/rest/home/tasks/filter/{filter}", filter)
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isUnauthorized())
        .andReturn();
  }

  @Test
  @DisplayName("Get task tags following the happy path it should succeed")
  @WithMockUser(username = "user@domain.com", password = "abcde123456A@")
  void getTasksTags_happyPath_shouldSucceed() throws Exception {
    when(homeService.getTopTasksTag()).thenReturn(List.of("tag1", "tag2"));

    mockMvc
        .perform(
            get("/rest/home/tasks/tags")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0]").value("tag1"))
        .andExpect(jsonPath("$[1]").value("tag2"))
        .andReturn();
  }

  @Test
  @DisplayName("Get task tags not authorized it should fail")
  void getTasksTags_notAuthorized_shouldSucceed() throws Exception {
    mockMvc
        .perform(
            get("/rest/home/tasks/tags")
                .with(csrf().asHeader())
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isUnauthorized())
        .andReturn();
  }
}
