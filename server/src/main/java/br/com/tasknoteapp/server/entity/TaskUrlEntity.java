package br.com.tasknoteapp.server.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
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

  @EmbeddedId private TaskUrlEntityPk id;
}
