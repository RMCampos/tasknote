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
import br.com.tasknoteapp.server.service.HomeService;
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
class HomeControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private HomeService homeService;

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
        .andExpect(status().isForbidden())
        .andReturn();
  }

  @Test
  @DisplayName("Search happy path should succeed")
  @WithMockUser(username = "user@domain.com", password = "abcde123456A@")
  void search_happyPath_shouldSucceed() throws Exception {
    TaskResponse task = new TaskResponse(1L, "Task 1", false, "now", List.of());
    NoteResponse note = new NoteResponse(1L, "Note 1", "Note desc", List.of());
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
        .andExpect(jsonPath("$.notes[0].urls", Matchers.empty()))
        .andReturn();
  }
}
