package br.com.tasknoteapp.java_api.response;

import br.com.tasknoteapp.java_api.entity.TaskEntity;
import br.com.tasknoteapp.java_api.entity.TaskUrlEntity;
import java.util.List;
import java.util.Objects;

public record TaskResponse(Long id, String description, Boolean done, List<String> urls) {

  public static TaskResponse fromEntity(TaskEntity entity) {
    List<TaskUrlEntity> urls = entity.getUrls();
    if (Objects.isNull(urls)) {
      urls = List.of();
    }

    return new TaskResponse(
        entity.getId(),
        entity.getDescription(),
        entity.getDone(),
        urls.stream().map(TaskUrlEntity::getUrl).toList());
  }
}
