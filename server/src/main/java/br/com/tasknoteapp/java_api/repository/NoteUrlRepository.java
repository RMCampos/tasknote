package br.com.tasknoteapp.java_api.repository;

import br.com.tasknoteapp.java_api.entity.NoteUrlEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteUrlRepository extends JpaRepository<NoteUrlEntity, Long> {

  void deleteAllByIdIn(List<Long> ids);
}
