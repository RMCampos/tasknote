package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.response.TaskResponse;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/** This class contains the implementation for the Home Service class. */
@Service
public class HomeService {

  private static final Logger logger = Logger.getLogger(HomeService.class.getName());

  private final TaskService taskService;

  private static final String N_TASKS_FOUND = "%d tasks found!";

  public HomeService(TaskService taskService) {
    this.taskService = taskService;
  }

  /**
   * Get up to 5 most used tags.
   *
   * @return List of String with the tags.
   */
  public List<String> getTopTasksTag() {
    logger.info("Getting top tags for the tasks");

    List<TaskResponse> tasks = taskService.getTasksByFilter("all");
    logger.info(String.format(N_TASKS_FOUND, tasks.size()));

    Map<String, Integer> tagsCount = new HashMap<>();
    for (TaskResponse task : tasks) {
      if (tagsCount.size() == 5) {
        break;
      }

      String tag = task.tag();
      if (tag.isBlank()) {
        tag = "untagged";
      }
      tagsCount.putIfAbsent(tag, 0);
      tagsCount.put(tag, tagsCount.get(tag) + 1);
    }

    Map<String, Integer> sortedDesc =
        tagsCount.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .collect(
                Collectors.toMap(
                    Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));

    return sortedDesc.keySet().stream().toList();
  }
}
