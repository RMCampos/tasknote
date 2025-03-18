import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Row
} from 'react-bootstrap';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { NoteResponse } from '../../types/NoteResponse';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';
import { translateServerResponse } from '../../utils/TranslatorUtils';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import TaskUrl from '../../components/TaskUrl';
import NoteTitle from '../../components/NoteTitle';
import ModalMarkdown from '../../components/ModalMarkdown';
import ContentHeader from '../../components/ContentHeader';
import AlertError from '../../components/AlertError';
import './style.css';

/**
 * The Note component is a view that displays a list of notes.
 *
 * @returns {React.ReactNode} The Task component
 */
function Note(): React.ReactNode {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [notes, setNotes] = useState<NoteResponse[]>([]);
  const [savedNotes, setSavedNotes] = useState<NoteResponse[]>([]);
  const [filterText, setFilterText] = useState<string>('');
  const [showPreviewMd, setShowPreviewMd] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<string>('');
  const { i18n, t } = useTranslation();

  /**
   * Handle errors from server requests and translate them if required.
   *
   * @param {unknown} e The error to be handled.
   */
  const handleError = (e: unknown): void => {
    if (typeof e === 'string') {
      setErrorMessage(translateServerResponse(e, i18n.language));
    }
    else if (e instanceof Error) {
      setErrorMessage(translateServerResponse(e.message, i18n.language));
    }
  };

  /**
   * Load notes from the server.
   */
  const loadNotes = async () => {
    try {
      const notesFetched: NoteResponse[] = await api.getJSON(ApiConfig.notesUrl);
      setNotes([...notesFetched]);
      setSavedNotes([...notesFetched]);
    }
    catch (e) {
      handleError(e);
    }
  };

  /**
   * Delete a note.
   *
   * @param {number} noteIdParam The note ID to be deleted.
   */
  const deleteNote = async (noteIdParam: number) => {
    try {
      await api.deleteNoContent(`${ApiConfig.notesUrl}/${noteIdParam}`);
      loadNotes();
    }
    catch (e) {
      handleError(e);
    }
  };

  /**
   * Filter notes by a given text.
   */
  const filterNotes = (text: string): void => {
    setFilterText(text);

    if (!text) {
      setNotes([...savedNotes]);
      return;
    }

    const filteredTasks = savedNotes.filter((note: NoteResponse) => {
      const anyTitleMatch = note.title.toLowerCase().includes(text.toLowerCase());
      const anyContentMatch = note.description.toLowerCase().includes(text.toLowerCase());
      const anyUrlMatch = note.url?.includes(text.toLowerCase());
      return anyTitleMatch || anyContentMatch || anyUrlMatch;
    });

    setNotes([...filteredTasks]);
  };

  const handleCloseModal = () => setShowPreviewMd(false);

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <Container>
      <ContentHeader
        h1TextRegular="All"
        h1TextBold="Notes"
        subtitle="Save your notes in plain text or Markdown format"
        h2BlackText="Create, Filter, and Easily Find"
        h2GreenText="Them"
      />

      <AlertError errorMessage={errorMessage} />

      <Row>
        <Col xs={12} sm={9}>
          <Form.Control
            type="text"
            id="search_term"
            size="lg"
            name="search_term"
            placeholder="Filter notes"
            value={filterText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => filterNotes(e.target.value)}
          />
        </Col>
        <Col xs={12} sm={3} className="mt-3 mt-sm-0">
          <NavLink to="/notes/new">
            <div className="d-grid gap-2">
              <Button variant="primary" size="lg" type="button" className="d-grip">
                Add note
              </Button>
            </div>
          </NavLink>
        </Col>
      </Row>

      <Row className="mt-3">
        {notes.map((note: NoteResponse) => (
          <Col xs={12} key={note.id.toString()}>
            <Card key={note.id.toString()} className="task-card">
              <Card.Body>
                <Row>
                  <Col xs={10}>
                    <Card.Title>
                      <NoteTitle title={note.title} />
                    </Card.Title>
                  </Col>
                  <Col xs={2} className="text-end">
                    <Dropdown>
                      <Dropdown.Toggle variant="success" data-testid={`note-dropdown-menu-${note.id}`}>
                        <ThreeDotsVertical />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <NavLink to={`/notes/edit/${note.id}`}>
                          <Dropdown.Item as="span">
                            {t('task_table_action_edit')}
                          </Dropdown.Item>
                        </NavLink>
                        <Dropdown.Item
                          as="button"
                          onClick={() => deleteNote(note.id)}
                          data-testid={`note-dropdown-delete-item-${note.id}`}
                        >
                          {t('task_table_action_delete')}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>

                {note.url && note.url.length > 0 && (
                  <TaskUrl url={note.url} />
                )}
              </Card.Body>
              <Card.Footer className="task-card-footer">
                <a
                  href="#"
                  onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setModalTitle(note.title);
                    setModalContent(note.description);
                    setShowPreviewMd(true);
                  }}
                  data-testid={`preview-markdown-link-${note.id}`}
                >
                  {' '}
                  Preview Markdown
                </a>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <ModalMarkdown
        show={showPreviewMd}
        onHide={handleCloseModal}
        title={modalTitle}
        markdownText={modalContent}
      />
    </Container>
  );
}

export default Note;
