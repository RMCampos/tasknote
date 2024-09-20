import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';

import TaskNoteRequest from '../../types/TaskNoteRequest';
import { NoteResponse } from '../../types/NoteResponse';
import './style.css';
import { addNoteRequest, deleteNoteRequest, getNotesRequest } from '../../api-service/noteService';

function Note(): JSX.Element {
  const [validated, setValidated] = useState<boolean>(true);
  const [formInvalid, setFormInvalid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [notes, setNotes] = useState<NoteResponse[]>([]);

  const handleError = (e: unknown): void => {
    if (typeof e === 'string') {
      setErrorMessage(e);
      setFormInvalid(true);
    } else if (e instanceof Error) {
      setErrorMessage(e.message);
      setFormInvalid(true);
    }
  }

  const addNote = async (desc: string, url?: string): Promise<boolean> => {
    const payload: TaskNoteRequest = {
      description: desc,
      urls: url? [url] : []
    };
    const response = await addNoteRequest(payload);

    if ('id' in response) {
      const note: NoteResponse = response;
      loadNotes();
      return true;
    } else {
      handleError(response);
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
      return;
    }

    setFormInvalid(false);
    const added: boolean = await addNote(form.description.value, form.url.value);
    if (added) {
      form.reset();
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
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    required
                    type="test"
                    name="description"
                    placeholder="Enter description"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="input-url">
                  <Form.Label>Additional URL</Form.Label>
                  <Form.Control
                    required={false}
                    type="text"
                    name="url"
                    placeholder="Additional URL (Optional)"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                >
                  Save
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
              <Card.Title>Note list</Card.Title>
              
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((note: NoteResponse) => (
                    <tr key={`note-${note.id}`}>
                      <td>{note.id}</td>
                      <td>{note.description}</td>
                      <td>
                        {note.urls.length > 0? (
                          <a href={`${note.urls[0].url}`}>Link</a>
                        ) : '-'}
                      </td>
                      <td>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => deleteNote(note.id)}
                      >
                        Delete
                      </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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
