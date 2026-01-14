package br.com.tasknoteapp.server.controller;

import br.com.tasknoteapp.server.entity.NoteEntity;
import br.com.tasknoteapp.server.exception.NoteNotFoundException;
import br.com.tasknoteapp.server.request.NotePatchRequest;
import br.com.tasknoteapp.server.request.NoteRequest;
import br.com.tasknoteapp.server.response.NoteResponse;
import br.com.tasknoteapp.server.service.NoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** This class provides resources to handle notes requests by the client. */
@RestController
@RequestMapping("/rest/notes")
@Tag(name = "Notes", description = "Notes resources to handle stored notes.")
public class NoteController {

  private final NoteService noteService;

  public NoteController(NoteService noteService) {
    this.noteService = noteService;
  }

  /**
   * Get all notes.
   *
   * @return List of NoteResponse with all found notes and its urls, if any.
   */
  @GetMapping
  @Operation(
      summary = "Get all notes",
      description = "Get all notes for the current user and its urls, if any",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "Notes successfully retrieved",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = NoteResponse.class, type = "array"))),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public List<NoteResponse> getAllNotes() {
    return noteService.getAllNotes();
  }

  /**
   * Get a note by its ID.
   *
   * @param id Note identification.
   * @return NoteResponse with note data and its urls, if any.
   * @throws NoteNotFoundException when note not found.
   */
  @GetMapping("/{id}")
  @Operation(
      summary = "Get a note by its ID",
      description = "Get a note by its ID and its urls, if any.",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "Return the found Note and its urls, if any."),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class))),
        @ApiResponse(
            responseCode = "404",
            description = "Note not found",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public NoteResponse getTaskById(
      @Parameter(
              name = "id",
              in = ParameterIn.PATH,
              description = "Note id to be fetched.",
              required = true,
              schema = @Schema(type = "integer", format = "int64"))
          @PathVariable
          Long id) {
    return noteService.getNoteById(id);
  }

  /**
   * Patch a note.
   *
   * @param id The note id to be patched.
   * @param noteRequest Note data to be patched, including optionally its urls.
   * @return NoteResponse containing data that was updated.
   * @throws NoteNotFoundException when note not found.
   */
  @PatchMapping("/{id}")
  @Operation(
      summary = "Patch a note",
      description = "Patch a note and all its urls. Option to patch only the urls.",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "Note successfully patched",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = NoteResponse.class))),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class))),
        @ApiResponse(
            responseCode = "404",
            description = "Note not found",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public ResponseEntity<NoteResponse> patchNote(
      @Parameter(
              name = "id",
              in = ParameterIn.PATH,
              description = "Note id to be patched.",
              required = true,
              schema = @Schema(type = "integer", format = "int64"))
          @PathVariable
          Long id,
      @io.swagger.v3.oas.annotations.parameters.RequestBody(
              description = "Note data to be patched, including optionally its urls.",
              required = true)
          @RequestBody
          @Valid
          NotePatchRequest noteRequest) {
    return ResponseEntity.ok(noteService.patchNote(id, noteRequest));
  }

  /**
   * Create a note.
   *
   * @param noteRequest Note data to be created, including optionally its urls. Following RESTful
   *     API pattern from https://restfulapi.net/rest-put-vs-post/.
   * @return NoteResponse containing data that was created.
   */
  @PostMapping
  @Operation(
      summary = "Create a note",
      description = "Create a note and all its urls.",
      responses = {
        @ApiResponse(
            responseCode = "201",
            description = "Note successfully crated.",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = NoteResponse.class))),
        @ApiResponse(
            responseCode = "400",
            description = "Wrong or missing information",
            content = @Content(schema = @Schema(implementation = Void.class))),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class))),
      })
  public ResponseEntity<NoteResponse> postNotes(
      @io.swagger.v3.oas.annotations.parameters.RequestBody(
              description = "Note data to be created, including optionally its urls.",
              required = true)
          @RequestBody
          @Valid
          NoteRequest noteRequest) {
    NoteEntity createdNote = noteService.createNote(noteRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(NoteResponse.fromEntity(createdNote));
  }

  /**
   * Delete a note given its ID.
   *
   * @param id Note identification.
   * @throws NoteNotFoundException when note not found.
   */
  @DeleteMapping("/{id}")
  @Operation(
      summary = "Delete a note",
      description = "Delete a note given its ID.",
      responses = {
        @ApiResponse(
            responseCode = "204",
            description = "Note successfully deleted",
            content = @Content(schema = @Schema(implementation = Void.class))),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized. Access Denied",
            content = @Content(schema = @Schema(implementation = Void.class))),
        @ApiResponse(
            responseCode = "404",
            description = "Note not found",
            content = @Content(schema = @Schema(implementation = Void.class)))
      })
  public ResponseEntity<Void> deleteNote(
      @Parameter(
              name = "id",
              in = ParameterIn.PATH,
              description = "Note id to be patched.",
              required = true,
              schema = @Schema(type = "integer", format = "int64"))
          @PathVariable
          Long id) {
    noteService.deleteNote(id);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }
}
