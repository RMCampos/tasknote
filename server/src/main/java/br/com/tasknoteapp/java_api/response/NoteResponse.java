package br.com.tasknoteapp.java_api.response;

import br.com.tasknoteapp.java_api.entity.NoteEntity;
import br.com.tasknoteapp.java_api.entity.NoteUrlEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/** This record represents a task and its urls object to be returned. */
@Schema(description = "This record represents a task and its urls object to be returned.")
public record NoteResponse(
    @Schema(description = "The id of the note", example = "1") Long id,
    @Schema(description = "The title of the note", example = "Note 1") String title,
    @Schema(description = "The description of the note", example = "Note desc") String description,
    @Schema(description = "The urls of the task, zero, one or more.", example = "[]")
        List<NoteUrlResponse> urls) {

  /**
   * Creates a NoteResponse given a NoteEntity and its Urls.
   *
   * @param entity The NoteEntity source data.
   * @return NoteResponse instance with all note data and urls, if any.
   */
  public static NoteResponse fromEntity(NoteEntity entity) {
    List<NoteUrlEntity> urls = entity.getUrls();
    List<NoteUrlResponse> urlsResponse = new ArrayList<>();
    if (Objects.isNull(urls)) {
      urls = List.of();
    } else {
      for (NoteUrlEntity url : urls) {
        NoteUrlResponse urlResponse = new NoteUrlResponse(url.getId(), url.getUrl());
        urlsResponse.add(urlResponse);
      }
    }

    return new NoteResponse(
        entity.getId(), entity.getTitle(), entity.getDescription(), urlsResponse);
  }
}
