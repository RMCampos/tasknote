package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.entity.NoteEntity;
import br.com.tasknoteapp.server.entity.NoteUrlEntity;
import br.com.tasknoteapp.server.entity.NotesCreatedEntity;
import br.com.tasknoteapp.server.entity.UserEntity;
import br.com.tasknoteapp.server.exception.NoteNotFoundException;
import br.com.tasknoteapp.server.exception.TaskNotFoundException;
import br.com.tasknoteapp.server.repository.NoteRepository;
import br.com.tasknoteapp.server.repository.NoteUrlRepository;
import br.com.tasknoteapp.server.repository.NotesCreatedRepository;
import br.com.tasknoteapp.server.request.NotePatchRequest;
import br.com.tasknoteapp.server.request.NoteRequest;
import br.com.tasknoteapp.server.response.NoteResponse;
import br.com.tasknoteapp.server.util.AuthUtil;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/** This class implements the NoteService interface methods. */
@Slf4j
@Service
@AllArgsConstructor
public class NoteService {

  private final NoteRepository noteRepository;

  private final AuthService authService;

  private final AuthUtil authUtil;

  private final NoteUrlRepository noteUrlRepository;

  private final NotesCreatedRepository notesCreatedRepository;

  /**
   * Get all notes for the current user.
   *
   * @return {@link List} of {@link NoteResponse} with all notes or an empty list.
   */
  public List<NoteResponse> getAllNotes() {
    UserEntity user = getCurrentUser();

    log.info("Get all notes to user {}", user.getId());

    List<NoteEntity> notes = noteRepository.findAllByUser_id(user.getId());
    log.info("{} notes found!", notes.size());

    return notes.stream().map(NoteResponse::fromEntity).toList();
  }

  /**
   * Get a note by its id.
   *
   * @param noteId The task id in the database.
   * @return {@link NoteResponse} with the found task or throw a {@link TaskNotFoundException}.
   */
  public NoteResponse getNoteById(Long noteId) {
    UserEntity user = getCurrentUser();
    log.info("Get note {} to user {}", noteId, user.getId());

    Optional<NoteEntity> task = noteRepository.findById(noteId);
    if (task.isEmpty()) {
      throw new NoteNotFoundException();
    }

    log.info("Note found! Id {}", noteId);
    return NoteResponse.fromEntity(task.get());
  }

  /**
   * Create a note for the user.
   *
   * @param noteRequest The note content.
   * @return {@link NoteEntity} created in the database
   */
  public NoteEntity createNote(NoteRequest noteRequest) {
    UserEntity user = getCurrentUser();

    log.info("Creating note to user {}", user.getId());

    NoteEntity note = new NoteEntity();
    note.setTitle(noteRequest.title());
    note.setDescription(noteRequest.description());
    note.setUser(user);
    NoteEntity created = noteRepository.save(note);

    if (!Objects.isNull(noteRequest.url()) && !noteRequest.url().isEmpty()) {
      NoteUrlEntity urlEntity = saveUrl(note, noteRequest.url());
      note.setNoteUrl(urlEntity);
    }

    Optional<NotesCreatedEntity> userNote = notesCreatedRepository.findById(user.getId());
    NotesCreatedEntity userNoteEntity = null;
    if (userNote.isPresent()) {
      userNoteEntity = userNote.get();
      userNoteEntity.setCount(userNoteEntity.getCount() + 1);
    } else {
      userNoteEntity = new NotesCreatedEntity();
      userNoteEntity.setCount(1);
      userNoteEntity.setUserId(user.getId());
    }

    notesCreatedRepository.save(userNoteEntity);

    log.info("Note created! Id {}", created.getId());
    return created;
  }

  /**
   * Patch an existing note updating its content.
   *
   * @param noteId The note id from the database.
   * @param patch An instance of {@link NotePatchRequest} with the new content.
   * @return {@link NoteResponse} containing the updated note.
   */
  @Transactional
  public NoteResponse patchNote(Long noteId, NotePatchRequest patch) {
    UserEntity user = getCurrentUser();

    log.info("Patching task {} to user {}", noteId, user.getId());

    Optional<NoteEntity> note = noteRepository.findById(noteId);
    if (note.isEmpty()) {
      throw new NoteNotFoundException();
    }

    NoteEntity noteEntity = note.get();
    if (!Objects.isNull(patch.title()) && !patch.title().isBlank()) {
      noteEntity.setTitle(patch.title());
    }
    if (!Objects.isNull(patch.description()) && !patch.description().isBlank()) {
      noteEntity.setDescription(patch.description());
    }

    noteUrlRepository.deleteByNote_id(noteId);
    log.info("URL deleted from task {}", noteId);

    if (!Objects.isNull(patch.url()) && !patch.url().isBlank()) {
      NoteUrlEntity urlEntity = saveUrl(noteEntity, patch.url());
      noteEntity.setNoteUrl(urlEntity);
    } else {
      log.info("No urls to patch for task {}", noteId);
    }

    NoteEntity patchedNote = noteRepository.save(noteEntity);

    log.info("Note patched! Id {}", patchedNote.getId());

    return NoteResponse.fromEntity(patchedNote);
  }

  /**
   * Delete a note and all its URLs, if any, for the user.
   *
   * @param noteId The note id from the database.
   */
  @Transactional
  public void deleteNote(Long noteId) {
    UserEntity user = getCurrentUser();

    log.info("Deleting note {} to user {}", noteId, user.getId());

    Optional<NoteEntity> note = noteRepository.findById(noteId);
    if (note.isEmpty()) {
      throw new NoteNotFoundException();
    }

    NoteUrlEntity noteUrl = note.get().getNoteUrl();
    if (!Objects.isNull(noteUrl)) {
      noteUrlRepository.delete(noteUrl);
      log.info("URL Deleted from task {}", noteId);
    } else {
      log.info("No urls to delete for task {}", noteId);
    }

    noteRepository.delete(note.get());

    log.info("Note deleted! Id {}", noteId);
  }

  /**
   * Search for notes given a search term.
   *
   * @param searchTerm The term to be used for the search.
   * @return {@link List} of {@link NoteResponse} with ound records or an empty list.
   */
  public List<NoteResponse> searchNotes(String searchTerm) {
    UserEntity user = getCurrentUser();

    log.info("Searching notes to user {}", user.getId());

    List<NoteEntity> notes =
        noteRepository.findAllBySearchTerm(searchTerm.toUpperCase(), user.getId());
    log.info("{} tasks found!", notes.size());

    return notes.stream().map(NoteResponse::fromEntity).toList();
  }

  private UserEntity getCurrentUser() {
    Optional<String> currentUserEmail = authUtil.getCurrentUserEmail();
    String email = currentUserEmail.orElseThrow();
    return authService.findByEmail(email).orElseThrow();
  }

  private NoteUrlEntity saveUrl(NoteEntity noteEntity, String url) {
    NoteUrlEntity taskUrl = new NoteUrlEntity();
    taskUrl.setUrl(url);
    taskUrl.setNote(noteEntity);

    NoteUrlEntity savedUrl = noteUrlRepository.save(taskUrl);
    log.info("URL saved to note {}", noteEntity.getId());

    return savedUrl;
  }
}
