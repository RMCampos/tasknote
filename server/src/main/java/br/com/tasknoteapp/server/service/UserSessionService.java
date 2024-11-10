package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.response.JwtAuthenticationResponse;
import br.com.tasknoteapp.server.response.NoteResponse;
import br.com.tasknoteapp.server.response.TaskResponse;
import br.com.tasknoteapp.server.response.UserResponse;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserSessionService {

  private final AuthService authService;

  private final TaskService taskService;

  private final NoteService noteService;

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
    List<TaskResponse> tasks = taskService.getAllTasks();
    for (TaskResponse task : tasks) {
      taskService.deleteTask(task.id());
    }

    List<NoteResponse> notes = noteService.getAllNotes();
    for (NoteResponse note : notes) {
      noteService.deleteNote(note.id());
    }

    return authService.deleteUserAccount();
  }
}
