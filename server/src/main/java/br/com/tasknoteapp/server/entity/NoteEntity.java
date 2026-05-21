package br.com.tasknoteapp.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import java.time.LocalDateTime;

/** This class represents a note in the database. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notes")
public class NoteEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;

  @Column(columnDefinition = "TEXT")
  private String description;

  @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, updatable = false)
  @ManyToOne(fetch = FetchType.LAZY)
  private UserEntity user;



  @Column(name = "last_update")
  private LocalDateTime lastUpdate;

  @Column(name = "shared", nullable = false)
  private boolean shared = false;

  @Column(name = "share_token", length = 36)
  private String shareToken;

  @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private Set<NoteTagEntity> noteTags = new HashSet<>();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
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

  public boolean isShared() {
    return shared;
  }

  public void setShared(boolean shared) {
    this.shared = shared;
  }

  public String getShareToken() {
    return shareToken;
  }

  public void setShareToken(String shareToken) {
    this.shareToken = shareToken;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    NoteEntity that = (NoteEntity) o;
    return id != null && id.equals(that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Override
  public String toString() {
    return "NoteEntity{"
        + "id="
        + id
        + ", title='"
        + title
        + '\''
        + ", description='"
        + description
        + '\''
        + ", lastUpdate="
        + lastUpdate
        + ", shared="
        + shared
        + ", shareToken='"
        + shareToken
        + '\''
        + '}';
  }
}
