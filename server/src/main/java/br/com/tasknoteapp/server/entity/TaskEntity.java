package br.com.tasknoteapp.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import java.time.LocalDate;
import java.time.LocalDateTime;

/** This class represents a task in the database. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tasks")
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

  @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private Set<TaskTagEntity> taskTags = new HashSet<>();



  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Boolean getDone() {
    return done;
  }

  public void setDone(Boolean done) {
    this.done = done;
  }

  public UserEntity getUser() {
    return user;
  }

  public void setUser(UserEntity user) {
    this.user = user;
  }

  public LocalDateTime getLastUpdate() {
    return lastUpdate;
  }

  public void setLastUpdate(LocalDateTime lastUpdate) {
    this.lastUpdate = lastUpdate;
  }

  public LocalDate getDueDate() {
    return dueDate;
  }

  public void setDueDate(LocalDate dueDate) {
    this.dueDate = dueDate;
  }

  public Boolean getHighPriority() {
    return highPriority;
  }

  public void setHighPriority(Boolean highPriority) {
    this.highPriority = highPriority;
  }



  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    TaskEntity that = (TaskEntity) o;
    return id != null && id.equals(that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Override
  public String toString() {
    return "TaskEntity{"
        + "id="
        + id
        + ", description='"
        + description
        + '\''
        + ", done="
        + done
        + ", lastUpdate="
        + lastUpdate
        + ", dueDate="
        + dueDate
        + ", highPriority="
        + highPriority
        + '}';
  }
}
