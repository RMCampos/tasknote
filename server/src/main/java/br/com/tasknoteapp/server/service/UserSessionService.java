package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.entity.UserEntity;
import br.com.tasknoteapp.server.exception.UserNotFoundException;
import br.com.tasknoteapp.server.response.JwtAuthenticationResponse;
import br.com.tasknoteapp.server.response.NoteResponse;
import br.com.tasknoteapp.server.response.TaskResponse;
import br.com.tasknoteapp.server.response.UserResponse;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

/** This class contains methods to handle user session and account deletion. */
@Service
public class UserSessionService {

  private final AuthService authService;

  private final TaskService taskService;

  private final NoteService noteService;

  /**
   * Constructor for UserSessionService.
   *
   * @param authService the authentication service
   * @param taskService the task service
   * @param noteService the note service
   */
  public UserSessionService(
      AuthService authService, TaskService taskService, NoteService noteService) {
    this.authService = authService;
    this.taskService = taskService;
    this.noteService = noteService;
  }

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
      Long taskId = task != null ? task.id() : null;
      if (taskId != null) {
        taskService.deleteTask(taskId);
      }
    }

    List<NoteResponse> notes = noteService.getAllNotes();
    for (NoteResponse note : notes) {
      Long noteId = note != null ? note.id() : null;
      if (noteId != null) {
        noteService.deleteNote(noteId);
      }
    }

    return authService.deleteUserAccount();
  }
}
