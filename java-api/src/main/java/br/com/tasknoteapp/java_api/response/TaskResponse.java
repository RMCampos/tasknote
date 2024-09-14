package br.com.tasknoteapp.java_api.response;

import br.com.tasknoteapp.java_api.entity.TaskEntity;
import br.com.tasknoteapp.java_api.entity.TaskUrlEntity;
import java.util.List;

public record TaskResponse(Long id, String description, Boolean done, List<String> urls) {

  public static TaskResponse fromEntity(TaskEntity entity) {
    return new TaskResponse(
        entity.getId(),
        entity.getDescription(),
        entity.getDone(),
        entity.getUrls().stream().map(TaskUrlEntity::getUrl).toList());
  }
}
