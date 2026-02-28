package br.com.tasknoteapp.server.repository;

import br.com.tasknoteapp.server.entity.NoteEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/** This interface represents a note repository, for database access. */
public interface NoteRepository extends JpaRepository<NoteEntity, Long> {

  List<NoteEntity> findAllByUser_id(Long userId);

  Optional<NoteEntity> findByShareToken(String shareToken);

  @Query(
      "select n from NoteEntity n where (upper(n.title) like %?1% or upper(n.description) like"
          + " %?1%) and n.user.id = ?2")
  List<NoteEntity> findAllBySearchTerm(String searchTerm, Long userId);
}
