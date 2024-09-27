package br.com.tasknoteapp.server.service;

import br.com.tasknoteapp.server.entity.NoteEntity;
import br.com.tasknoteapp.server.request.NotePatchRequest;
import br.com.tasknoteapp.server.request.NoteRequest;
import br.com.tasknoteapp.server.response.NoteResponse;
import java.util.List;

public interface NoteService {

  public List<NoteResponse> getAllNotes();

  public NoteEntity createNote(NoteRequest noteRequest);

  public NoteResponse patchNote(Long taskId, NotePatchRequest taskRequest);

  public void deleteNote(Long noteId);

  public List<NoteResponse> searchNotes(String searchTerm);
}
