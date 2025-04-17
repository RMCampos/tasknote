package br.com.tasknoteapp.server.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/** This class represents a done task for a user in the database. */
@Data
@Entity
@ToString
@Table(name = "user_tasks_done")
@EqualsAndHashCode
public class UserTasksDone {

  @EmbeddedId private UserTasksDonePk id;

  @Column(name = "done_date")
  private LocalDateTime doneDate;
}
