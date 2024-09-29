package br.com.tasknoteapp.server.repository;

import br.com.tasknoteapp.server.entity.NoteEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface NoteRepository extends JpaRepository<NoteEntity, Long> {

  List<NoteEntity> findAllByUser_id(Long userId);

  @Query(
      "select n from NoteEntity n where (upper(n.title) like %?1% or upper(n.description) like"
          + " %?1%) and n.user.id = ?2")
  List<NoteEntity> findAllBySearchTerm(String searchTerm, Long userId);
}
