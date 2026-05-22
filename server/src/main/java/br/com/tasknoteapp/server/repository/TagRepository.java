package br.com.tasknoteapp.server.repository;

import br.com.tasknoteapp.server.entity.TagEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** This interface represents a tag repository, for database access. */
public interface TagRepository extends JpaRepository<TagEntity, Long> {

  Optional<TagEntity> findByNameAndUser_id(String name, Long userId);

  List<TagEntity> findAllByUser_idOrderByNameAsc(Long userId);
}
