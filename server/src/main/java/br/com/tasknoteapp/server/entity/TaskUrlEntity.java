package br.com.tasknoteapp.server.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** This class represents a task url in the database. */
@Entity
@Table(name = "task_url")
public class TaskUrlEntity {

  @EmbeddedId private TaskUrlEntityPk id;

  public TaskUrlEntityPk getId() {
    return id;
  }

  public void setId(TaskUrlEntityPk id) {
    this.id = id;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    TaskUrlEntity that = (TaskUrlEntity) o;
    return id != null && id.equals(that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Override
  public String toString() {
    return "TaskUrlEntity{" + "id=" + id + '}';
  }
}
