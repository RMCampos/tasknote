import React, { useEffect, useState } from 'react';
import { Accordion, Alert, Button, Card, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';

import TaskNoteRequest from '../../types/TaskNoteRequest';
import { NoteResponse } from '../../types/NoteResponse';
import './style.css';
import { addNoteRequest, deleteNoteRequest, getNotesRequest, updateNoteRequest } from '../../api-service/noteService';

type NoteAction = 'add' | 'edit';

function Note(): JSX.Element {
  const [validated, setValidated] = useState<boolean>(true);
  const [formInvalid, setFormInvalid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [notes, setNotes] = useState<NoteResponse[]>([]);
  const [noteId, setNoteId] = useState<number>(0);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteDescription, setNoteDescription] = useState<string>('');
  const [action, setAction] = useState<NoteAction>('add');

  const handleError = (e: unknown): void => {
    if (typeof e === 'string') {
      setErrorMessage(e);
      setFormInvalid(true);
    } else if (e instanceof Error) {
      setErrorMessage(e.message);
      setFormInvalid(true);
    }
  }

  const addNote = async (payload: TaskNoteRequest): Promise<boolean> => {
    let response = await addNoteRequest(payload);

    if ('id' in response) {
      const note: NoteResponse = response;
      loadNotes();
      return true;
    } else {
      handleError(response);
    }
    return false;
  };

  const submitEditNote = async (payload: NoteResponse): Promise<boolean> => {
    let response: Error | undefined = await updateNoteRequest(payload);

    if (response instanceof Error) {
      handleError(response);
    } else {
      loadNotes();
      return true;
    }
    return false;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setFormInvalid(true);
      setErrorMessage('Please fill all fields');
      return;
    }

    setFormInvalid(false);

    const title: string = form.note_title.value;
    const description: string = form.note_description.value;
    
    if (action === 'add') {
      const payload: TaskNoteRequest = {
        title: title,
        description: description,
        urls: []
      };

      const added: boolean = await addNote(payload);
      if (added) {
        form.reset();
        setNoteId(0);
        setNoteTitle('');
        setNoteDescription('');
        setAction('add');
      }
    } else if (action === 'edit') {
      const payload: NoteResponse = {
        id: noteId,
        title: title,
        description: description,
        urls: []
      };

      const edited: boolean = await submitEditNote(payload);
      if (edited) {
        form.reset();
        setNoteId(0);
        setNoteTitle('');
        setNoteDescription('');
        setAction('add');
      }
    }
  };

  const loadNotes = async() => {
    const notes: NoteResponse[] | Error = await getNotesRequest();
    if (notes instanceof Error) {
      handleError(notes);
    } else {
      setNotes(notes);
    }
  };

  const deleteNote = async (noteId: number) => {
    const response: Error | undefined = await deleteNoteRequest(noteId);
    if (response instanceof Error) {
      handleError(response);
    } else {
      loadNotes();
    }
  };

  const editNote = async (note: NoteResponse) => {
    setNoteId(note.id);
    setNoteTitle(note.title);
    setNoteDescription(note.description);
    setAction('edit');
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <Container>
      <Row className="mt-3">
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Card.Title>Add note</Card.Title>

              {formInvalid ? (
                <Alert variant={"danger"}>
                  { errorMessage }
                </Alert>
              ) : null}
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="form_noteTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="note_title"
                    value={noteTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setNoteTitle(e.target.value);
                    }}
                    placeholder="Enter the note title"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="form_noteDescription">
                  <Form.Label>Note content</Form.Label>
                  <Form.Control
                    as="textarea"
                    required
                    rows={3}
                    name="note_description"
                    placeholder="Enter the note content"
                    value={noteDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setNoteDescription(e.target.value);
                    }}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                >
                  Save note
                </Button>
              </Form>
              
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Accordion defaultActiveKey="0">
              {notes.map((note: NoteResponse) => (
                <Accordion.Item key={note.id.toString()} eventKey={note.id.toString()}>
                  <Accordion.Header>
                    {note.title}
                  </Accordion.Header>
                  <Accordion.Body>
                    {note.description.split(/(?:\r\n|\r|\n)/g).map((item: string) => {
                      return (
                        <>
                          <span key={item}>{item}</span>
                          <br />
                        </>
                      )
                    })}
                    
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => editNote(note)}
                      className="mt-3"
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => deleteNote(note.id)}
                      className="mt-3 mx-3"
                    >
                      Delete
                    </Button>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
              </Accordion>
              
            </Card.Body>
            <Card.Footer>
              {notes.length === 0? 'No notes' : `${notes.length} note(s)`}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Note;
