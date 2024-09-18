package br.com.tasknoteapp.java_api.response;

import br.com.tasknoteapp.java_api.entity.TaskEntity;
import br.com.tasknoteapp.java_api.entity.TaskUrlEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public record TaskResponse(Long id, String description, Boolean done, List<TaskUrlResponse> urls) {

  public static TaskResponse fromEntity(TaskEntity entity) {
    List<TaskUrlEntity> urls = entity.getUrls();
    List<TaskUrlResponse> urlsResponse = new ArrayList<>();
    if (Objects.isNull(urls)) {
      urls = List.of();
    } else {
      for (TaskUrlEntity url : urls) {
        TaskUrlResponse urlResponse = new TaskUrlResponse(url.getId(), url.getUrl());
        urlsResponse.add(urlResponse);
      }
    }

    return new TaskResponse(
        entity.getId(), entity.getDescription(), entity.getDone(), urlsResponse);
  }
}
