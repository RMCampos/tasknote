package br.com.tasknoteapp.java_api.repository;

import br.com.tasknoteapp.java_api.entity.TaskEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<TaskEntity, Long> {

  List<TaskEntity> findAllByUserId(Long userId);
}
