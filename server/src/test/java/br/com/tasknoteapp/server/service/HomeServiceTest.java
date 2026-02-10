package br.com.tasknoteapp.server.service;

import static org.mockito.Mockito.when;

import br.com.tasknoteapp.server.response.TaskResponse;
import br.com.tasknoteapp.server.util.AuthUtil;
import java.util.List;
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

  @Mock private AuthUtil authUtil;

  @Mock private AuthService authService;

  private HomeService homeService;

  @BeforeEach
  void setUp() {
    homeService = new HomeService(taskService);
  }

  @Test
  @DisplayName("Get tasks tags should return all tags ordered alphabetically")
  void getTopTasksTag_shouldReturnAllTagsAlphabetically() {
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

    List<String> tags = homeService.getTopTasksTag();

    Assertions.assertNotNull(tags);
    Assertions.assertEquals(6, tags.size());
    Assertions.assertEquals(List.of("tag1", "tag2", "tag3", "tag4", "tag5", "tag6"), tags);
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
