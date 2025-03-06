package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.entity.UserEntity;
import br.com.tasknoteapp.server.entity.UserTasksDone;
import br.com.tasknoteapp.server.repository.UserTasksDoneRepository;
import br.com.tasknoteapp.server.response.NoteResponse;
import br.com.tasknoteapp.server.response.SearchResponse;
import br.com.tasknoteapp.server.response.SummaryResponse;
import br.com.tasknoteapp.server.response.TaskResponse;
import br.com.tasknoteapp.server.response.TasksChartResponse;
import br.com.tasknoteapp.server.util.AuthUtil;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/** This class contains the implementation for the Home Service class. */
@Slf4j
@Service
@AllArgsConstructor
public class HomeService {

  private final TaskService taskService;

  private final NoteService noteService;

  private final UserTasksDoneRepository userTasksDoneRepository;

  private final AuthUtil authUtil;

  private final AuthService authService;

  /**
   * Get summary for the home page.
   *
   * @return SummaryResponse with data.
   */
  public SummaryResponse getSummary() {
    log.info("Getting summary");
    List<TaskResponse> tasks = taskService.getAllTasks();
    List<NoteResponse> notes = noteService.getAllNotes();

    long doneCount = tasks.stream().filter(t -> t.done() == true).count();
    long undoneCount = tasks.stream().filter(t -> t.done() == false).count();
    int taskCount = notes.size();

    return new SummaryResponse((int) undoneCount, (int) doneCount, taskCount);
  }

  /**
   * Search for tasks and notes.
   *
   * @param term The term to be searched for.
   * @return SearchResponse containing found both tasks and notes, if any.
   */
  public SearchResponse search(String term) {
    log.info("Searching for {}", term);

    List<TaskResponse> tasks = taskService.searchTasks(term);
    log.info("{} tasks found!", tasks.size());

    List<NoteResponse> notes = noteService.searchNotes(term);
    log.info("{} notes found!", notes.size());

    return new SearchResponse(tasks, notes);
  }

  /**
   * Get the data for the completed tasks chart.
   *
   * @return List of TasksChartResponse.
   */
  public List<TasksChartResponse> getTasksChartData() {
    Optional<String> currentUserEmail = authUtil.getCurrentUserEmail();
    String email = currentUserEmail.orElseThrow();
    UserEntity user = authService.findByEmail(email).orElseThrow();

    LocalDateTime date = LocalDateTime.now();
    List<UserTasksDone> tasks =
        userTasksDoneRepository.findAllByDoneDateAfterAndId_userId(
            date.minusDays(8L), user.getId());
    log.info("Tasks finished in the last 7 days: {}", tasks.size());

    if (tasks.isEmpty()) {
      return createListFromDate(date);
    }

    Map<String, Integer> dataMap = new HashMap<>();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    for (UserTasksDone taskDone : tasks) {
      String formattedDateTime = taskDone.getDoneDate().format(formatter);
      dataMap.putIfAbsent(formattedDateTime, 0);
      dataMap.put(formattedDateTime, dataMap.get(formattedDateTime) + 1);
    }

    for (int i = 0; i < 7; i++) {
      LocalDateTime dateUpdated = date.minusDays(i);
      String formattedDateTime = dateUpdated.format(formatter);
      dataMap.putIfAbsent(formattedDateTime, 0);
    }

    List<TasksChartResponse> chartData = new ArrayList<>();
    for (Map.Entry<String, Integer> entry : dataMap.entrySet()) {
      log.info("Day: {}, Count: {}", entry.getKey(), entry.getValue());
      LocalDate parsedDate = LocalDate.parse(entry.getKey(), formatter);
      chartData.add(
          new TasksChartResponse(
              parsedDate.atStartOfDay(),
              getDayOfWeek(parsedDate.atStartOfDay()),
              entry.getValue()));
    }

    chartData.sort((t1, t2) -> t2.date().compareTo(t1.date()));

    return chartData;
  }

  private List<TasksChartResponse> createListFromDate(LocalDateTime date) {
    List<TasksChartResponse> list = new ArrayList<>();
    for (int i = 0; i < 7; i++) {
      LocalDateTime dateUpdated = date.minusDays(i);
      list.add(new TasksChartResponse(dateUpdated, getDayOfWeek(dateUpdated), 0));
    }
    return list;
  }

  private String getDayOfWeek(LocalDateTime date) {
    return date.getDayOfWeek().toString().substring(0, 3);
  }
}
