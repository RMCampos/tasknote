package br.com.tasknoteapp.server.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import br.com.tasknoteapp.server.entity.NotesCreatedEntity;
import br.com.tasknoteapp.server.entity.UserEntity;
import br.com.tasknoteapp.server.entity.UserTasksDone;
import br.com.tasknoteapp.server.entity.UserTasksDonePk;
import br.com.tasknoteapp.server.repository.NotesCreatedRepository;
import br.com.tasknoteapp.server.repository.UserTasksDoneRepository;
import br.com.tasknoteapp.server.response.NoteResponse;
import br.com.tasknoteapp.server.response.SearchResponse;
import br.com.tasknoteapp.server.response.SummaryResponse;
import br.com.tasknoteapp.server.response.TaskResponse;
import br.com.tasknoteapp.server.response.TasksChartResponse;
import br.com.tasknoteapp.server.util.AuthUtil;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class HomeServiceTest {

  @Mock private TaskService taskService;

  @Mock private NoteService noteService;

  @Mock private UserTasksDoneRepository userTasksDoneRepository;

  @Mock private AuthUtil authUtil;

  @Mock private AuthService authService;

  @Mock private NotesCreatedRepository notesCreatedRepository;

  private HomeService homeService;

  private List<TaskResponse> tasks;
  private List<NoteResponse> notes;

  @BeforeEach
  void setUp() {
    homeService =
        new HomeService(
            taskService,
            noteService,
            userTasksDoneRepository,
            authUtil,
            authService,
            notesCreatedRepository);

    TaskResponse task1 =
        new TaskResponse(2L, "Task 1", false, false, null, null, null, "tag", List.of());
    TaskResponse task2 =
        new TaskResponse(3L, "Task 2", false, false, null, null, null, "tag", List.of());
    tasks = List.of(task1, task2);

    NoteResponse note1 = new NoteResponse(453L, "Note 1", "desc", null, "tag");
    NoteResponse note2 = new NoteResponse(455L, "Note 2", "desc", null, "tag");
    notes = List.of(note1, note2);
  }

  @Test
  void getSummary_shouldReturnSummaryResponse() {
    String userEmail = "user@domain.com";
    when(authUtil.getCurrentUserEmail()).thenReturn(Optional.of(userEmail));

    UserEntity userEntity = new UserEntity();
    userEntity.setId(1L);
    userEntity.setEmail(userEmail);
    when(authService.findByEmail(userEmail)).thenReturn(Optional.of(userEntity));

    when(taskService.getAllTasks()).thenReturn(tasks);

    NotesCreatedEntity notesCreated = new NotesCreatedEntity(userEntity.getId(), 2);
    when(notesCreatedRepository.findById(userEntity.getId())).thenReturn(Optional.of(notesCreated));

    SummaryResponse summary = homeService.getSummary();

    Assertions.assertEquals(2, summary.pendingTaskCount());
    Assertions.assertEquals(0, summary.doneTaskCount());
    Assertions.assertEquals(2, summary.notesCount());
  }

  @Test
  void search_shouldReturnSearchResponse() {
    String term = "note";
    when(taskService.searchTasks(term)).thenReturn(List.of());
    when(noteService.searchNotes(term)).thenReturn(notes);

    SearchResponse searchResponse = homeService.search(term);

    Assertions.assertEquals(0, searchResponse.tasks().size());
    Assertions.assertEquals(2, searchResponse.notes().size());
  }

  @Test
  @DisplayName("Get tasks chart data happy path should succeed")
  void getTasksChartData_happyPath_shouldSucceed() {
    String userEmail = "user@domain.com";
    when(authUtil.getCurrentUserEmail()).thenReturn(Optional.of(userEmail));

    Long userId = 1L;
    UserEntity userEntity = new UserEntity();
    userEntity.setId(userId);
    userEntity.setEmail(userEmail);
    when(authService.findByEmail(userEmail)).thenReturn(Optional.of(userEntity));

    LocalDateTime now = LocalDateTime.now();

    Long taskId = 2L;
    UserTasksDone userTasksDone = new UserTasksDone();
    userTasksDone.setId(new UserTasksDonePk(userId, taskId));
    userTasksDone.setDoneDate(now);
    when(userTasksDoneRepository.findAllByDoneDateAfterAndId_userId(any(), any()))
        .thenReturn(List.of(userTasksDone));

    List<TasksChartResponse> chartData = homeService.getTasksChartData();

    String firstDay = now.getDayOfWeek().toString().substring(0, 3);

    Assertions.assertNotNull(chartData);
    Assertions.assertEquals(7, chartData.size());
    Assertions.assertEquals(firstDay, chartData.get(0).day());
  }

  @Test
  @DisplayName("Get tasks chart data empty data should succeed")
  void getTasksChartData_emptyData_shouldSucceed() {
    Long userId = 1L;
    String userEmail = "user@domain.com";
    when(authUtil.getCurrentUserEmail()).thenReturn(Optional.of(userEmail));

    UserEntity userEntity = new UserEntity();
    userEntity.setId(userId);
    userEntity.setEmail(userEmail);
    when(authService.findByEmail(userEmail)).thenReturn(Optional.of(userEntity));

    when(userTasksDoneRepository.findAllByDoneDateAfterAndId_userId(any(), any()))
        .thenReturn(List.of());

    List<TasksChartResponse> chartData = homeService.getTasksChartData();

    LocalDateTime now = LocalDateTime.now();
    String firstDay = now.getDayOfWeek().toString().substring(0, 3);

    Assertions.assertNotNull(chartData);
    Assertions.assertEquals(7, chartData.size());
    Assertions.assertEquals(firstDay, chartData.get(0).day());
  }
}
