package br.com.tasknoteapp.server.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/** This class represents a task url in the database. */
@Data
@Entity
@ToString
@Table(name = "task_url")
@EqualsAndHashCode
public class TaskUrlEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String url;

  @JoinColumn(name = "task_id", referencedColumnName = "id", nullable = false, updatable = false)
  @ManyToOne(fetch = FetchType.LAZY)
  private TaskEntity task;
}
