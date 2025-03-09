package br.com.tasknoteapp.server.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/** This class represents a note url in the database. */
@Data
@Entity
@ToString
@Table(name = "note_urls")
@EqualsAndHashCode
public class NoteUrlEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String url;

  @JoinColumn(name = "note_id", referencedColumnName = "id", nullable = false, updatable = false)
  @OneToOne(fetch = FetchType.LAZY)
  private NoteEntity note;
}
