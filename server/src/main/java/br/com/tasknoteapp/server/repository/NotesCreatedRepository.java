package br.com.tasknoteapp.server.repository;

import br.com.tasknoteapp.server.entity.NotesCreatedEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/** This interface represents a notes created for a user in the database. */
public interface NotesCreatedRepository extends JpaRepository<NotesCreatedEntity, Long> {}
