package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.response.NoteResponse;
import br.com.tasknoteapp.server.response.TaskResponse;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/** This class contains the implementation for the Home Service class. */
@Service
public class HomeService {

  private static final Logger logger = LoggerFactory.getLogger(HomeService.class);

  private final TaskService taskService;

  private final NoteService noteService;

  public HomeService(TaskService taskService, NoteService noteService) {
    this.taskService = taskService;
    this.noteService = noteService;
  }

  /**
   * Get all existing tags, ordered alphabetically.
   *
   * @return List of String with the tags.
   */
  public List<String> getTopTasksTag() {
    logger.info("Getting all tags for tasks and notes");

    List<TaskResponse> tasks = taskService.getTasksByFilter("all");
    List<NoteResponse> notes = noteService.getAllNotes();

    Set<String> tags = new HashSet<>();
    tags.addAll(
        tasks.stream()
            .map(TaskResponse::tag)
            .filter(tag -> tag != null && !tag.isBlank())
            .toList());
    tags.addAll(
        notes.stream()
            .map(NoteResponse::tag)
            .filter(tag -> tag != null && !tag.isBlank())
            .toList());

    boolean hasBlankTags =
        tasks.stream().anyMatch(task -> task.tag() == null || task.tag().isBlank())
            || notes.stream().anyMatch(note -> note.tag() == null || note.tag().isBlank());
    if (hasBlankTags) {
      tags.add("untagged");
    }

    logger.info("Found {} tags", tags.size());

    return tags.stream().sorted().toList();
  }
}
