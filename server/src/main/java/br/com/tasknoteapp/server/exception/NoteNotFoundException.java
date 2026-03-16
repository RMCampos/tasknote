package br.com.tasknoteapp.server.exception;

/** This class represents a Note Not Found request. */
public class NoteNotFoundException extends BaseNotFoundException {

  public NoteNotFoundException() {
    super("note", "Note not found");
  }
}
