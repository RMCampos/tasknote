package br.com.tasknoteapp.server.response;

import br.com.tasknoteapp.server.entity.TaskEntity;
import br.com.tasknoteapp.server.util.TimeAgoUtil;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.List;

/** This record represents a task and its urls object to be returned. */
@Schema(description = "This record represents a task and its urls object to be returned.")
public record TaskResponse(
    @Schema(description = "The id of the task", example = "1") Long id,
    @Schema(description = "The description of the task", example = "Task 1") String description,
    @Schema(description = "The done status of the task", example = "false") Boolean done,
    @Schema(description = "Defined if it's high priority", example = "true") Boolean highPriority,
    @Schema(description = "Task due date, if any.", example = "true") LocalDate dueDate,
    @Schema(description = "Task due date, if any.", example = "true") String dueDateFmt,
    @Schema(description = "When was the last update time of the task") String lastUpdate,
    @Schema(description = "Task tag, optional.") String tag,
    @Schema(description = "The urls of the task, zero, one or more.", example = "[]")
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
