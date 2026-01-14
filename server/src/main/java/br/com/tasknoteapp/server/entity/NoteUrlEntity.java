package br.com.tasknoteapp.server.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/** This class represents a note url in the database. */
@Entity
@Table(name = "note_urls")
public class NoteUrlEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String url;

  @JoinColumn(name = "note_id", referencedColumnName = "id", nullable = false, updatable = false)
  @OneToOne(fetch = FetchType.LAZY)
  private NoteEntity note;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }

  public NoteEntity getNote() {
    return note;
  }

  public void setNote(NoteEntity note) {
    this.note = note;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    NoteUrlEntity that = (NoteUrlEntity) o;
    return id != null && id.equals(that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Override
  public String toString() {
    return "NoteUrlEntity{" + "id=" + id + ", url='" + url + '\'' + '}';
  }
}
