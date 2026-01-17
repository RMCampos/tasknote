package br.com.tasknoteapp.server.response;

import br.com.tasknoteapp.server.entity.TaskEntity;
import br.com.tasknoteapp.server.util.TimeAgoUtil;
import java.time.LocalDate;
import java.util.List;

/** This record represents a task and its urls object to be returned. */
public record TaskResponse(
    Long id,
    String description,
    Boolean done,
    Boolean highPriority,
    LocalDate dueDate,
    String dueDateFmt,
    String lastUpdate,
    String tag,
    List<String> urls) {

  /**
   * Creates a TaskResponse given a TaskEntity and its Urls.
   *
   * @param entity The TaskEntity source data.
   * @return TaskResponse instance with all task data and urls, if any.
   */
  public static TaskResponse fromEntity(TaskEntity entity, List<String> urls) {
    String timeAgoFmt = TimeAgoUtil.format(entity.getLastUpdate());
    String dueDateFmt = TimeAgoUtil.formatDueDate(entity.getDueDate());

    return new TaskResponse(
        entity.getId(),
        entity.getDescription(),
        entity.getDone(),
        entity.getHighPriority(),
        entity.getDueDate(),
        dueDateFmt,
        timeAgoFmt,
        entity.getTag(),
        urls);
  }
}
