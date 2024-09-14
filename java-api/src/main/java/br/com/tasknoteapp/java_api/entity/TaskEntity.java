package br.com.tasknoteapp.java_api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@Entity
@Table(name = "tasks")
@ToString
@EqualsAndHashCode
public class TaskEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String description;

  private Boolean done;

  @JoinColumn(name = "user_id", nullable = false, updatable = false)
  @OneToOne(fetch = FetchType.LAZY)
  private UserEntity user;

  private List<TaskUrlEntity> urls;
}
