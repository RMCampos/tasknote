package br.com.tasknoteapp.server.service;

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

  private static final String N_TASKS_FOUND = "%d tasks found!";

  public HomeService(TaskService taskService) {
    this.taskService = taskService;
  }

  /**
   * Get all existing tags, ordered alphabetically.
   *
   * @return List of String with the tags.
   */
  public List<String> getTopTasksTag() {
    logger.info("Getting all tags for the tasks");

    List<TaskResponse> tasks = taskService.getTasksByFilter("all");
    logger.info(String.format(N_TASKS_FOUND, tasks.size()));

    Set<String> tags = new HashSet<>();
    for (TaskResponse task : tasks) {
      String tag = task.tag();
      if (tag.isBlank()) {
        tag = "untagged";
      }
      tags.add(tag);
    }

    return tags.stream().sorted().toList();
  }
}
