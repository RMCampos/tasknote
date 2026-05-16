package br.com.tasknoteapp.server.response;

import br.com.tasknoteapp.server.entity.NoteEntity;
import br.com.tasknoteapp.server.util.TimeAgoUtil;

/** This record represents a task and its URLs object to be returned. */
public record NoteResponse(
    Long id, String title, String description, String url, String lastUpdate, String tag,
    boolean shared, String shareToken) {

  /**
   * Creates a NoteResponse given a NoteEntity and its Urals.
   *
   * @param entity The NoteEntity source data.
   * @return NoteResponse instance with all note data and URLs, if any.
   */
  public static NoteResponse fromEntity(NoteEntity entity, String url) {
    String timeAgoFmt = TimeAgoUtil.format(entity.getLastUpdate());

    return new NoteResponse(
        entity.getId(),
        entity.getTitle(),
        entity.getDescription(),
        url,
        timeAgoFmt,
        entity.getTag(),
        entity.isShared(),
        entity.getShareToken());
  }
}
