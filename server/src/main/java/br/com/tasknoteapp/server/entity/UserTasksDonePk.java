package br.com.tasknoteapp.server.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** This class represents a UserTasksDone primary key. */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Embeddable
public class UserTasksDonePk {
  
  private Long userId;

  private Long taskId;
}
