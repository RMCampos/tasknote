package br.com.tasknoteapp.server.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** This class represents a UrlTaskEntity primary key. */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Embeddable
public class TaskUrlEntityPk {

  private Long taskId;

  private String url;
}
