package br.com.tasknoteapp.server.repository;

import br.com.tasknoteapp.server.entity.NoteUrlEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** This interface represents a note url repository, for database access. */
public interface NoteUrlRepository extends JpaRepository<NoteUrlEntity, Long> {

  Optional<NoteUrlEntity> findByNote_id(Long noteId);

  List<NoteUrlEntity> findAllByNote_idIn(List<Long> noteIds);

  void deleteByNote_id(Long noteId);
}
