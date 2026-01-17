package br.com.tasknoteapp.server.response;

import br.com.tasknoteapp.server.entity.NoteEntity;
import br.com.tasknoteapp.server.entity.NoteUrlEntity;
import br.com.tasknoteapp.server.util.TimeAgoUtil;
import java.util.Objects;

/** This record represents a task and its urls object to be returned. */
public record NoteResponse(
    Long id, String title, String description, String url, String lastUpdate, String tag) {

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
