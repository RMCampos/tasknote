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

  @Test
  @DisplayName("Get tasks by filter high priority tasks it should succeed")
  void getTasksByFilter_highTasks_shouldSucceed() {
    String filter = "high";

    TaskResponse highTask1 =
        new TaskResponse(2L, "Task 1", false, true, null, null, null, "tag", List.of());
    when(taskService.getTasksByFilter(filter)).thenReturn(List.of(highTask1));

    List<TaskResponse> list = homeService.getTasksByFilter(filter);

    Assertions.assertNotNull(list);
    Assertions.assertEquals(1, list.size());
    Assertions.assertTrue(list.get(0).highPriority());
  }

  @Test
  @DisplayName("Get top tasks tag should return up to 5 most used tags")
  void getTopTasksTag_shouldReturnTopTags() {
    TaskResponse task1 =
        new TaskResponse(1L, "Task 1", false, false, null, null, null, "tag1", List.of());
    TaskResponse task2 =
        new TaskResponse(2L, "Task 2", false, false, null, null, null, "tag2", List.of());
    TaskResponse task3 =
        new TaskResponse(3L, "Task 3", false, false, null, null, null, "tag1", List.of());
    TaskResponse task4 =
        new TaskResponse(4L, "Task 4", false, false, null, null, null, "tag3", List.of());
    TaskResponse task5 =
        new TaskResponse(5L, "Task 5", false, false, null, null, null, "tag2", List.of());
    TaskResponse task6 =
        new TaskResponse(6L, "Task 6", false, false, null, null, null, "tag4", List.of());
    TaskResponse task7 =
        new TaskResponse(7L, "Task 7", false, false, null, null, null, "tag5", List.of());
    TaskResponse task8 =
        new TaskResponse(8L, "Task 8", false, false, null, null, null, "tag6", List.of());

    when(taskService.getTasksByFilter("all"))
        .thenReturn(List.of(task1, task2, task3, task4, task5, task6, task7, task8));

    List<String> topTags = homeService.getTopTasksTag();

    Assertions.assertNotNull(topTags);
    Assertions.assertEquals(5, topTags.size());
    Assertions.assertTrue(topTags.contains("tag1"));
    Assertions.assertTrue(topTags.contains("tag2"));
    Assertions.assertTrue(topTags.contains("tag3"));
    Assertions.assertTrue(topTags.contains("tag4"));
    Assertions.assertTrue(topTags.contains("tag5"));
  }

  @Test
  @DisplayName("Get top tasks tag with no tags should return empty list")
  void getTopTasksTag_noTags_shouldReturnEmptyList() {
    when(taskService.getTasksByFilter("all")).thenReturn(List.of());

    List<String> topTags = homeService.getTopTasksTag();

    Assertions.assertNotNull(topTags);
    Assertions.assertTrue(topTags.isEmpty());
  }

  @Test
  @DisplayName("Get top tasks tag with blank tags should handle untagged tasks")
  void getTopTasksTag_blankTags_shouldHandleUntagged() {
    TaskResponse task1 =
        new TaskResponse(1L, "Task 1", false, false, null, null, null, "", List.of());
    TaskResponse task2 =
        new TaskResponse(2L, "Task 2", false, false, null, null, null, " ", List.of());
    TaskResponse task3 =
        new TaskResponse(3L, "Task 3", false, false, null, null, null, "tag1", List.of());

    when(taskService.getTasksByFilter("all")).thenReturn(List.of(task1, task2, task3));

    List<String> topTags = homeService.getTopTasksTag();

    Assertions.assertNotNull(topTags);
    Assertions.assertEquals(2, topTags.size());
    Assertions.assertTrue(topTags.contains("untagged"));
    Assertions.assertTrue(topTags.contains("tag1"));
  }
}
