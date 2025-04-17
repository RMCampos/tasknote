package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.entity.NotesCreatedEntity;
import br.com.tasknoteapp.server.entity.UserEntity;
import br.com.tasknoteapp.server.entity.UserTasksDone;
import br.com.tasknoteapp.server.exception.UserNotFoundException;
import br.com.tasknoteapp.server.repository.NotesCreatedRepository;
import br.com.tasknoteapp.server.repository.UserTasksDoneRepository;
import br.com.tasknoteapp.server.response.JwtAuthenticationResponse;
import br.com.tasknoteapp.server.response.NoteResponse;
import br.com.tasknoteapp.server.response.TaskResponse;
import br.com.tasknoteapp.server.response.UserResponse;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

/** This class contains methods to handle user session and account deletion. */
@Service
@AllArgsConstructor
public class UserSessionService {

  private final AuthService authService;

  private final TaskService taskService;

  private final NoteService noteService;

  private final UserTasksDoneRepository userTasksDoneRepository;

  private final NotesCreatedRepository notesCreatedRepository;

  /**
   * Refresh the current user session with a new JWT token.
   *
   * @return The new JWT token generated
   */
  public JwtAuthenticationResponse refreshUserSession() {
    String token = authService.refreshCurrentUserToken();
    return new JwtAuthenticationResponse(token);
  }

  /**
   * Delete the current user account content and data.
   *
   * @return {@link UserResponse} with user data
   */
  @Transactional
  public UserResponse deleteCurrentUserAccount() {
    Optional<UserEntity> userOptional = authService.getCurrentUser();
    if (userOptional.isEmpty()) {
      throw new UserNotFoundException();
    }

    List<TaskResponse> tasks = taskService.getAllTasks();
    for (TaskResponse task : tasks) {
      taskService.deleteTask(task.id());
    }

    List<NoteResponse> notes = noteService.getAllNotes();
    for (NoteResponse note : notes) {
      noteService.deleteNote(note.id());
    }

    Long userId = userOptional.get().getId();
    List<UserTasksDone> doneTasks = userTasksDoneRepository.findAllById_userId(userId);
    if (!doneTasks.isEmpty()) {
      userTasksDoneRepository.deleteAllInBatch(doneTasks);
    }

    List<NotesCreatedEntity> notesStats = notesCreatedRepository.findAllByUserId(userId);
    if (!notesStats.isEmpty()) {
      notesCreatedRepository.deleteAll(notesStats);
    }

    return authService.deleteUserAccount();
  }
}
