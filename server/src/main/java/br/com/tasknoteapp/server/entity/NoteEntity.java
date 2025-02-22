package br.com.tasknoteapp.server.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/** This class represents a note in the database. */
@Data
@Entity
@Table(name = "notes")
@ToString
@EqualsAndHashCode
public class NoteEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;

  private String description;

  @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, updatable = false)
  @ManyToOne(fetch = FetchType.LAZY)
  private UserEntity user;

  @OneToMany(mappedBy = "note", fetch = FetchType.LAZY)
  private List<NoteUrlEntity> urls;

  @Column(name = "tag", nullable = true, length = 30)
  private String tag;
}
