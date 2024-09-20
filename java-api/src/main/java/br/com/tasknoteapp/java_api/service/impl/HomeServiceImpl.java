package br.com.tasknoteapp.java_api.service.impl;

import br.com.tasknoteapp.java_api.response.NoteResponse;
import br.com.tasknoteapp.java_api.response.SearchResponse;
import br.com.tasknoteapp.java_api.response.SummaryResponse;
import br.com.tasknoteapp.java_api.response.TaskResponse;
import br.com.tasknoteapp.java_api.service.HomeService;
import br.com.tasknoteapp.java_api.service.NoteService;
import br.com.tasknoteapp.java_api.service.TaskService;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/** This class contains the implementation for the Home Service class. */
@Slf4j
@Service
@AllArgsConstructor
class HomeServiceImpl implements HomeService {

  private final TaskService taskService;

  private final NoteService noteService;

  /**
   * Get summary for the home page.
   *
   * @return SummaryResponse with data.
   */
  @Override
  public SummaryResponse getSummary() {
    log.info("Getting summary");
    List<TaskResponse> tasks = taskService.getAllTasks();

    long doneCount = tasks.stream().filter(t -> t.done() == true).count();
    long undoneCount = tasks.stream().filter(t -> t.done() == false).count();

    return new SummaryResponse((int) undoneCount, (int) doneCount);
  }

  /**
   * Search for tasks and notes.
   *
   * @param term The term to be searched for.
   * @return SearchResponse containing found both tasks and notes, if any.
   */
  @Override
  public SearchResponse search(String term) {
    log.info("Searching for {}", term);

    List<TaskResponse> tasks = taskService.searchTasks(term);
    log.info("{} tasks found!", tasks.size());

    List<NoteResponse> notes = noteService.searchNotes(term);
    log.info("{} notes found!", notes.size());

    return new SearchResponse(tasks, notes);
  }
}
