package br.com.tasknoteapp.server.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/** This class represents a task in the database. */
@Data
@Entity
@Table(name = "tasks")
@ToString
@EqualsAndHashCode
public class TaskEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(length = 2000)
  private String description;

  private Boolean done;

  @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, updatable = false)
  @ManyToOne(fetch = FetchType.LAZY)
  private UserEntity user;

  @Column(name = "last_update")
  private LocalDateTime lastUpdate;

  @Column(name = "due_date")
  private LocalDate dueDate;

  @Column(name = "high_priority")
  private Boolean highPriority;

  @Column(name = "tag", nullable = true, length = 30)
  private String tag;
}
