package br.com.tasknoteapp.server.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import br.com.tasknoteapp.server.response.NoteResponse;
import br.com.tasknoteapp.server.response.SearchResponse;
import br.com.tasknoteapp.server.response.SummaryResponse;
import br.com.tasknoteapp.server.response.TaskResponse;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class HomeServiceTest {

  @Mock private TaskService taskService;

  @Mock private NoteService noteService;

  private HomeService homeService;

  private List<TaskResponse> tasks;
  private List<NoteResponse> notes;

  @BeforeEach
  void setUp() {
    homeService = new HomeService(taskService, noteService);

    TaskResponse task1 =
        new TaskResponse(2L, "Task 1", false, false, null, null, null, "tag", List.of());
    TaskResponse task2 =
        new TaskResponse(3L, "Task 2", false, false, null, null, null, "tag", List.of());
    tasks = List.of(task1, task2);

    NoteResponse note1 = new NoteResponse(453L, "Note 1", "desc", List.of(), "tag");
    NoteResponse note2 = new NoteResponse(455L, "Note 2", "desc", List.of(), "tag");
    notes = List.of(note1, note2);
  }

  @Test
  void getSummary_shouldReturnSummaryResponse() {
    when(taskService.getAllTasks()).thenReturn(tasks);
    when(noteService.getAllNotes()).thenReturn(notes);

    SummaryResponse summary = homeService.getSummary();

    assertEquals(2, summary.pendingTaskCount());
    assertEquals(0, summary.doneTaskCount());
    assertEquals(2, summary.notesCount());
  }

  @Test
  void search_shouldReturnSearchResponse() {
    String term = "note";
    when(taskService.searchTasks(term)).thenReturn(List.of());
    when(noteService.searchNotes(term)).thenReturn(notes);

    SearchResponse searchResponse = homeService.search(term);

    assertEquals(0, searchResponse.tasks().size());
    assertEquals(2, searchResponse.notes().size());
  }
}
