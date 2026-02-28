package br.com.tasknoteapp.server.controller;

import br.com.tasknoteapp.server.exception.NoteNotFoundException;
import br.com.tasknoteapp.server.response.NoteResponse;
import br.com.tasknoteapp.server.service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** This class provides public (unauthenticated) resources for shared notes. */
@RestController
@RequestMapping("/public/notes")
public class PublicNoteController {

  private final NoteService noteService;

  public PublicNoteController(NoteService noteService) {
    this.noteService = noteService;
  }

  /**
   * Get a publicly shared note by its share token.
   *
   * @param token The unique share token for the note.
   * @return NoteResponse containing the shared note data.
   * @throws NoteNotFoundException when note is not found or not shared.
   */
  @GetMapping("/{token}")
  public ResponseEntity<NoteResponse> getSharedNote(@PathVariable String token) {
    return ResponseEntity.ok(noteService.getSharedNote(token));
  }
}
