package br.com.tasknoteapp.server.repository;

import br.com.tasknoteapp.server.entity.NoteUrlEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/** This interface represents a note url repository, for database access. */
public interface NoteUrlRepository extends JpaRepository<NoteUrlEntity, Long> {

  void deleteByNote_id(Long noteId);
}
