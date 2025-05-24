package br.com.tasknoteapp.server.response;

import br.com.tasknoteapp.server.entity.NoteEntity;
import br.com.tasknoteapp.server.entity.NoteUrlEntity;
import br.com.tasknoteapp.server.util.TimeAgoUtil;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Objects;

/** This record represents a task and its urls object to be returned. */
@Schema(description = "This record represents a task and its urls object to be returned.")
public record NoteResponse(
    @Schema(description = "The id of the note", example = "1") Long id,
    @Schema(description = "The title of the note", example = "Note 1") String title,
    @Schema(description = "The description of the note", example = "Note desc") String description,
    @Schema(description = "The urls of the task, zero, one or more.", example = "[]") String url,
    @Schema(description = "When was the last update time of the note") String lastUpdate,
    @Schema(description = "Task tag, optional.") String tag) {

  /**
   * Creates a NoteResponse given a NoteEntity and its Urls.
   *
   * @param entity The NoteEntity source data.
   * @return NoteResponse instance with all note data and urls, if any.
   */
  public static NoteResponse fromEntity(NoteEntity entity) {
    NoteUrlEntity noteUrl = entity.getNoteUrl();
    String url = Objects.isNull(noteUrl) ? null : noteUrl.getUrl();
    String timeAgoFmt = TimeAgoUtil.format(entity.getLastUpdate());

    return new NoteResponse(
        entity.getId(),
        entity.getTitle(),
        entity.getDescription(),
        url,
        timeAgoFmt,
        entity.getTag());
  }
}
