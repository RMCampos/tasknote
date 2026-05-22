package br.com.tasknoteapp.server.repository;

import br.com.tasknoteapp.server.entity.NoteEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** This interface represents a note repository, for database access. */
public interface NoteRepository extends JpaRepository<NoteEntity, Long> {

  List<NoteEntity> findAllByUser_id(Long userId);

  Optional<NoteEntity> findByShareToken(String shareToken);

  Optional<NoteEntity> findByIdAndUser_id(Long id, Long userId);

  @Query(
      """
      select distinct n
      from NoteEntity n
      left join n.tags tg
      where (
        upper(n.title) like upper(concat('%', :searchTerm, '%')) or
        upper(n.description) like upper(concat('%', :searchTerm, '%')) or
        upper(tg.name) like upper(concat('%', :searchTerm, '%'))
      ) and n.user.id = :userId
      """)
  List<NoteEntity> findAllBySearchTerm(
      @Param("searchTerm") String searchTerm, @Param("userId") Long userId);
}
