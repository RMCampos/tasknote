package br.com.tasknoteapp.java_api.service;

import br.com.tasknoteapp.java_api.entity.NoteEntity;
import br.com.tasknoteapp.java_api.request.NotePatchRequest;
import br.com.tasknoteapp.java_api.request.NoteRequest;
import br.com.tasknoteapp.java_api.response.NoteResponse;
import java.util.List;

public interface NoteService {

  public List<NoteResponse> getAllNotes();

  public NoteEntity createNote(NoteRequest noteRequest);

  public NoteResponse patchNote(Long taskId, NotePatchRequest taskRequest);

  public void deleteNote(Long noteId);

  public List<NoteResponse> searchNotes(String searchTerm);
}
