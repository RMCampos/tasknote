package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.entity.NoteEntity;
import br.com.tasknoteapp.server.entity.NoteUrlEntity;
import br.com.tasknoteapp.server.entity.UserEntity;
import br.com.tasknoteapp.server.exception.NoteNotFoundException;
import br.com.tasknoteapp.server.exception.TaskNotFoundException;
import br.com.tasknoteapp.server.repository.NoteRepository;
import br.com.tasknoteapp.server.repository.NoteUrlRepository;
import br.com.tasknoteapp.server.request.NotePatchRequest;
import br.com.tasknoteapp.server.request.NoteRequest;
import br.com.tasknoteapp.server.response.NoteResponse;
import br.com.tasknoteapp.server.util.AuthUtil;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/** This class implements the NoteService interface methods. */
@Service
public class NoteService {

  private static final Logger logger = LoggerFactory.getLogger(NoteService.class);

  private final NoteRepository noteRepository;

  private final AuthService authService;

  private final AuthUtil authUtil;

  private final NoteUrlRepository noteUrlRepository;

  /**
   * Constructor for the NoteService class.
   *
   * @param noteRepository The repository for note entities.
   * @param authService The service for authentication.
   * @param authUtil Utility class for authentication-related operations.
   * @param noteUrlRepository The repository for note URL entities.
   */
  public NoteService(
      NoteRepository noteRepository,
      AuthService authService,
      AuthUtil authUtil,
      NoteUrlRepository noteUrlRepository) {
    this.noteRepository = noteRepository;
    this.authService = authService;
    this.authUtil = authUtil;
    this.noteUrlRepository = noteUrlRepository;
  }

  /**
   * Get all notes for the current user.
   *
   * @return {@link List} of {@link NoteResponse} with all notes or an empty list.
   */
  public List<NoteResponse> getAllNotes() {
    UserEntity user = getCurrentUser();

    logger.info("Get all notes to user " + user.getId());

    List<NoteEntity> notes = noteRepository.findAllByUser_id(user.getId());
    logger.info(notes.size() + " notes found!");

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
    logger.info("Get note " + noteId + " to user " + user.getId());

    Optional<NoteEntity> task = noteRepository.findById(noteId);
    if (task.isEmpty()) {
      throw new NoteNotFoundException();
    }

    logger.info("Note found! Id " + noteId);
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

    logger.info("Creating note to user " + user.getId());

    NoteEntity note = new NoteEntity();
    note.setTitle(noteRequest.title());
    note.setDescription(noteRequest.description());
    note.setTag(noteRequest.tag());
    note.setLastUpdate(LocalDateTime.now());
    note.setUser(user);
    NoteEntity created = noteRepository.save(note);

    logger.info("Note created! Id " + created.getId());

    if (!Objects.isNull(noteRequest.url()) && !noteRequest.url().isEmpty()) {
      NoteUrlEntity urlEntity = saveUrl(note, noteRequest.url());
      note.setNoteUrl(urlEntity);
    }

    logger.info("Finished note creation!");
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

    logger.info("Patching task " + noteId + " to user " + user.getId());

    Optional<NoteEntity> note = noteRepository.findById(noteId);
    if (note.isEmpty()) {
      throw new NoteNotFoundException();
    }

    NoteEntity noteEntity = note.get();
    if (!Objects.isNull(patch.title()) && !patch.title().isBlank()) {
      noteEntity.setTitle(patch.title().trim());
    }
    if (!Objects.isNull(patch.description()) && !patch.description().isBlank()) {
      noteEntity.setDescription(patch.description());
    }
    if (!Objects.isNull(patch.tag()) && !patch.tag().isBlank()) {
      noteEntity.setTag(patch.tag().trim());
    }
    noteEntity.setLastUpdate(LocalDateTime.now());

    noteUrlRepository.deleteByNote_id(noteId);
    noteUrlRepository.flush();
    logger.info("URL deleted from task " + noteId);

    if (!Objects.isNull(patch.url()) && !patch.url().isBlank()) {
      NoteUrlEntity urlEntity = saveUrl(noteEntity, patch.url());
      noteEntity.setNoteUrl(urlEntity);
    } else {
      logger.info("No urls to patch for task " + noteId);
    }

    NoteEntity patchedNote = noteRepository.save(noteEntity);
    noteRepository.flush();

    logger.info("Note patched! Id " + patchedNote.getId());

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

    logger.info("Deleting note " + noteId + " to user " + user.getId());

    Optional<NoteEntity> note = noteRepository.findById(noteId);
    if (note.isEmpty()) {
      throw new NoteNotFoundException();
    }

    NoteEntity noteEntity = note.get();

    NoteUrlEntity noteUrl = noteEntity.getNoteUrl();
    if (!Objects.isNull(noteUrl)) {
      noteUrlRepository.delete(noteUrl);
      logger.info("URL Deleted from task " + noteId);
    } else {
      logger.info("No urls to delete for task " + noteId);
    }

    noteRepository.delete(noteEntity);

    logger.info("Note deleted! Id " + noteId);
  }

  /**
   * Search for notes given a search term.
   *
   * @param searchTerm The term to be used for the search.
   * @return {@link List} of {@link NoteResponse} with found records or an empty list.
   */
  public List<NoteResponse> searchNotes(String searchTerm) {
    UserEntity user = getCurrentUser();

    logger.info("Searching notes to user " + user.getId());

    List<NoteEntity> notes =
        noteRepository.findAllBySearchTerm(searchTerm.toUpperCase(), user.getId());
    logger.info(notes.size() + " tasks found!");
    return notes.stream().map(NoteResponse::fromEntity).toList();
  }

  private UserEntity getCurrentUser() {
    Optional<String> currentUserEmail = authUtil.getCurrentUserEmail();
    String email = currentUserEmail.orElseThrow();
    return authService.findByEmail(email).orElseThrow();
  }

  private NoteUrlEntity saveUrl(NoteEntity noteEntity, String url) {
    NoteUrlEntity noteUrl = new NoteUrlEntity();
    noteUrl.setUrl(url);
    noteUrl.setNote(noteEntity);

    NoteUrlEntity savedUrl = noteUrlRepository.save(noteUrl);
    logger.info("URL saved to note " + noteEntity.getId());

    return savedUrl;
  }
}
