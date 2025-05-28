import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Row
} from 'react-bootstrap';
import { TaskResponse } from '../../types/TaskResponse';
import { NoteResponse } from '../../types/NoteResponse';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';
import { handleDefaultLang } from '../../lang-service/LangHandler';
import { translateServerResponse, translateTaskResponse } from '../../utils/TranslatorUtils';
import AuthContext from '../../context/AuthContext';
import ContentHeader from '../../components/ContentHeader';
import AlertError from '../../components/AlertError';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { NavLink } from 'react-router';
import ModalMarkdown from '../../components/ModalMarkdown';
import TaskTitle from '../../components/TaskTitle';
import TaskTimeLeft from '../../components/TaskTimeLeft';
import TaskTag from '../../components/TaskTag';
import NoteTitle from '../../components/NoteTitle';

/**
 * Home page component.
 *
 * This component displays the home page of the application,
 *
 * @returns {React.ReactNode} The Home page component.
 */
function Home(): React.ReactNode {
  const { user } = useContext(AuthContext);
  const { i18n, t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [name, setName] = useState<string>(user?.name ? user?.name : 'User');
  const [showMarkdownView, setShowMarkdownView] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<string>('');
  const [filterText, setFilterText] = useState<string>('');
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [notes, setNotes] = useState<NoteResponse[]>([]);
  const [savedNotes, setSavedNotes] = useState<NoteResponse[]>([]);
  const [savedTasks, setSavedTasks] = useState<TaskResponse[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('everything');

  /**
   * Handles the error by setting the error message.
   *
   * @param {unknown} e - The error to handle.
   */
  const handleError = (e: unknown): void => {
    if (typeof e === 'string') {
      setErrorMessage(translateServerResponse(e, i18n.language));
    }
    else if (e instanceof Error) {
      setErrorMessage(translateServerResponse(e.message, i18n.language));
    }
  };

  const loadTags = async (): Promise<void> => {
    try {
      const response: string[] = await api.getJSON(`${ApiConfig.homeUrl}/tasks/tags`);
      setTags(response);
    }
    catch (e) {
      handleError(e);
    }
  };

  /**
   * Mark a task as done or undone.
   *
   * @param {TaskResponse} task The task to be marked as done or undone.
   */
  const markAsDone = async (task: TaskResponse): Promise<void> => {
    try {
      await api.deleteNoContent(`${ApiConfig.tasksUrl}/${task.id}`);
      loadAllTasks();
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
      loadAllNotes();
    }
    catch (e) {
      handleError(e);
    }
  };

  /**
   * Filter notes by a given text.
   */
  const filterTasksAndNotes = (text: string, radioFilter?: string): void => {
    setFilterText(text);

    if (!text && !radioFilter) {
      setNotes([...savedNotes]);
      setTasks([...savedTasks]);
      return;
    }

    const tagToFilter = radioFilter?.startsWith('radio_') ? radioFilter.substring(6) : '';

    if (radioFilter && radioFilter === 'onlyTasks') {
      setNotes([]);
    }
    else {
      let filteredNotes = savedNotes.filter((note: NoteResponse) => {
        const anyTitleMatch = note.title.toLowerCase().includes(text.toLowerCase());
        const anyContentMatch = note.description.toLowerCase().includes(text.toLowerCase());
        const anyUrlMatch = note.url?.includes(text.toLowerCase());
        return anyTitleMatch || anyContentMatch || anyUrlMatch;
      });

      if (tagToFilter === 'untagged') {
        filteredNotes = filteredNotes.filter((note: NoteResponse) => !note.tag);
      }
      else if (tagToFilter) {
        filteredNotes = filteredNotes.filter((note: NoteResponse) => note.tag && note.tag === tagToFilter);
      }

      setNotes([...filteredNotes]);
    }

    if (radioFilter && radioFilter === 'onlyNotes') {
      setTasks([]);
    }
    else {
      let filteredTasks = savedTasks.filter((task: TaskResponse) => {
        const shouldFilter = task.description.toLowerCase().includes(text.toLowerCase())
          || task.tag.toLowerCase().includes(text.toLowerCase())
          || task.urls.filter((url: string) => url.includes(text.toLowerCase())).length > 0;
        return shouldFilter;
      });

      if (tagToFilter === 'untagged') {
        filteredTasks = filteredTasks.filter((task: TaskResponse) => !task.tag);
      }
      else if (tagToFilter) {
        filteredTasks = filteredTasks.filter((task: TaskResponse) => task.tag && task.tag === tagToFilter);
      }

      setTasks([...filteredTasks]);
    }
  };

  /**
   * Load tasks from the server.
   */
  const loadAllTasks = async () => {
    try {
      const tasksFetched: TaskResponse[] = await api.getJSON(ApiConfig.tasksUrl);
      const translated = translateTaskResponse(tasksFetched, i18n.language);
      translated.sort((t1, t2) => {
        if (t1.highPriority === t2.highPriority) {
          return 0;
        }
        if (t1.highPriority) {
          return -1;
        }
        return 1;
      });
      setSavedTasks([...translated]);
      setTasks([...translated]);
      setSelectedOption('everything');
    }
    catch (e) {
      handleError(e);
    }
  };

  /**
   * Load notes from the server.
   */
  const loadAllNotes = async () => {
    try {
      const notesFetched: NoteResponse[] = await api.getJSON(ApiConfig.notesUrl);
      setNotes([...notesFetched]);
      setSavedNotes([...notesFetched]);
    }
    catch (e) {
      handleError(e);
    }
  };

  const cleanText = (text: string): string => {
    if (!text) {
      return text;
    }

    let cleaned = text.trim();
    if (cleaned.startsWith('- ')) {
      cleaned = cleaned.substring(2);
    }
    if (cleaned.startsWith('#')) {
      cleaned = text.replaceAll('#', '').trim();
    }
    cleaned = cleaned.replaceAll('`', '');
    cleaned = cleaned.replaceAll('**', '');

    // check for url pattern
    if (cleaned.includes('[') && cleaned.includes('](') && cleaned.includes('(')) {
      cleaned = cleaned.replaceAll(' [', ' ');
      cleaned = cleaned.replaceAll('](', ' - ');
      if (cleaned.endsWith(')')) {
        cleaned = cleaned.substring(0, cleaned.length - 1);
      }
      if (cleaned.endsWith('/')) {
        cleaned = cleaned.substring(0, cleaned.length - 1);
      }
    }
    if (cleaned.endsWith(';')) {
      cleaned = cleaned.substring(0, cleaned.length - 1);
    }
    if (cleaned.endsWith(':')) {
      cleaned = cleaned.substring(0, cleaned.length - 1);
    }

    // check for dot line
    if (cleaned.startsWith('.')) {
      cleaned = cleaned.substring(0, cleaned.length - 1);
    }

    // shorten the line up to 100
    const max = window.innerWidth / 15;
    if (cleaned.length > max) {
      cleaned = cleaned.substring(0, max);
    }
    return cleaned;
  };

  const getFirstRows = (content: string): string => {
    const lines = content.split('\n');
    const preview: string[] = [];
    const maxLines = 2;
    for (let i = 0; i < 10; i++) {
      const clean = cleanText(lines[i]);
      if (clean !== '') {
        preview.push(clean);
        if (preview.length === maxLines) {
          break;
        }
      }
    }
    return preview.join('\n');
  };

  const handleCloseModal = () => setShowMarkdownView(false);

  useEffect(() => {
    handleDefaultLang();
    setName(user?.name ?? 'User');
    loadTags();
    loadAllTasks();
    loadAllNotes();
  }, [user]);

  return (
    <Container fluid>
      <ContentHeader
        h1TextRegular={t('home_welcome_title')}
        h1TextBold={name}
        subtitle={t('home_welcome_subtitle')}
        h2BlackText={t('home_welcome_start')}
        h2GreenText={t('home_welcome_productive')}
        isHomeComponent
        newTaskI18n={t('task_form_title')}
        newNoteI18n={t('note_form_title')}
      />

      <AlertError
        errorMessage={errorMessage}
        onClose={() => {
          setErrorMessage('');
        }}
      />

      <Row>
        <Col xs={12}>
          <Form.Control
            type="text"
            id="search_term"
            size="lg"
            name="search_term"
            placeholder={t('home_input_filter')}
            value={filterText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => filterTasksAndNotes(e.target.value, selectedOption)}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <Form className="mt-3 ms-1">
            <div className="d-flex gap-3">
              <Form.Check
                inline
                type="radio"
                label={t('home_radio_everything')}
                name="radioGroup"
                id="everything"
                value="everything"
                checked={selectedOption === 'everything'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  setSelectedOption(e.target.value);
                  filterTasksAndNotes(filterText, e.target.value);
                }}
                className="custom-radio-button"
              />
              <Form.Check
                inline
                type="radio"
                label={t('home_radio_tasks')}
                name="radioGroup"
                id="onlyTasks"
                value="onlyTasks"
                checked={selectedOption === 'onlyTasks'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  setSelectedOption(e.target.value);
                  filterTasksAndNotes(filterText, e.target.value);
                }}
                className="custom-radio-button"
              />
              <Form.Check
                inline
                type="radio"
                label={t('home_radio_notes')}
                name="radioGroup"
                id="onlyNotes"
                value="onlyNotes"
                checked={selectedOption === 'onlyNotes'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  setSelectedOption(e.target.value);
                  filterTasksAndNotes(filterText, e.target.value);
                }}
                className="custom-radio-button"
              />
              {tags.map((tag: string) => (
                <Form.Check
                  key={tag}
                  inline
                  type="radio"
                  label={`#${tag}`}
                  name="radioGroup"
                  id={`radio_${tag}`}
                  value={`radio_${tag}`}
                  checked={selectedOption === `radio_${tag}`}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    setSelectedOption(e.target.value);
                    filterTasksAndNotes(filterText, e.target.value);
                  }}
                  className="custom-radio-button"
                />
              ))}
            </div>
          </Form>
        </Col>
      </Row>

      <Row className="mt-3">
        {tasks.map((task: TaskResponse) => (
          <Col xs={12} key={task.id.toString()}>
            <Card key={task.id.toString()} className={`task-card ${task.highPriority ? 'high-importance' : ''}`}>
              <Card.Body>
                <Row>
                  <Col xs={10}>
                    <Card.Title>
                      <TaskTitle
                        title={task.description}
                        done={task.done}
                        taskUrl={task.urls}
                      />
                    </Card.Title>
                  </Col>
                  <Col xs={2} className="text-end">
                    <Dropdown>
                      <Dropdown.Toggle variant="success">
                        <ThreeDotsVertical />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {!task.done && (
                          <NavLink to={`/tasks/edit/${task.id}`}>
                            <Dropdown.Item as="span">
                              {t('task_table_action_edit')}
                            </Dropdown.Item>
                          </NavLink>
                        )}
                        <Dropdown.Item as="button" onClick={() => markAsDone(task)}>
                          {task.done ? t('task_table_action_undone') : t('task_table_action_done')}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>

                {task.dueDateFmt && (
                  <TaskTimeLeft
                    text={task.dueDateFmt}
                    done={task.done}
                    tooltip={task.dueDate}
                  />
                )}
              </Card.Body>
              <Card.Footer className="task-card-footer">
                <TaskTag
                  tag={task.tag}
                  lastUpdate={task.lastUpdate}
                  taskOrNote="task"
                />
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        {notes.map((note: NoteResponse) => (
          <Col xs={12} key={note.id.toString()}>
            <Card key={note.id.toString()} className="mb-3">
              <Card.Body>
                <Row>
                  <Col xs={10}>
                    <Card.Title>
                      <NoteTitle
                        title={note.title}
                        noteUrl={note.url}
                      />
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

                <span className="text-muted span-line-break font-size-14">
                  {getFirstRows(note.description)}
                </span>
              </Card.Body>
              <Card.Footer className="task-card-footer">
                <TaskTag
                  tag={note.tag}
                  lastUpdate={note.lastUpdate}
                  taskOrNote="note"
                  onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setModalTitle(note.title);
                    setModalContent(note.description);
                    setShowMarkdownView(true);
                  }}
                />
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <ModalMarkdown
        show={showMarkdownView}
        onHide={handleCloseModal}
        title={modalTitle}
        markdownText={modalContent}
      />
    </Container>
  );
}

export default Home;
