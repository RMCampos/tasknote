import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row
} from 'react-bootstrap';
import { HomeSearchResponse } from '../../types/HomeSearchResponse';
import { TaskResponse } from '../../types/TaskResponse';
import { NoteResponse } from '../../types/NoteResponse';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';
import { handleDefaultLang } from '../../lang-service/LangHandler';
import { translateServerResponse } from '../../utils/TranslatorUtils';
import CompletedTasks from '../../components/CompletedTasks';
import TaskProgress from '../../components/TaskProgress';
import AuthContext from '../../context/AuthContext';
import ContentHeader from '../../components/ContentHeader';
import AlertError from '../../components/AlertError';
import { Search } from 'react-bootstrap-icons';
import HomeFilterButton from '../../components/HomeFilterButton';
import { SearchResults } from '../../components/SearchResults';
import { useNavigate } from 'react-router';
import { SearchNoteResults } from '../../components/SearchNoteResults';
import ModalMarkdown from '../../components/ModalMarkdown';

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
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [validated, setValidated] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<HomeSearchResponse | null>(null);
  const [name, setName] = useState<string>(user?.name ? user?.name : 'User');
  const [lastSearch, setLastSearch] = useState<string>('');
  const [showMarkdownView, setShowMarkdownView] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<string>('');
  const [searchTermValue, setSearchTermValue] = useState<string>('');

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

  /**
   * Searches for a term.
   *
   * @param {string}
   * @returns {Promise<boolean>} Whether the search was successful.
   */
  const searchTerm = async (term: string): Promise<boolean> => {
    try {
      const response: HomeSearchResponse = await api.getJSON(`${ApiConfig.homeUrl}/search?term=${term}`);
      setSearchResults(response);
      setLastSearch(`textSearch#${term}`);
      return true;
    }
    catch (e) {
      handleError(e);
    }
    return false;
  };

  /**
   * Handles the search form submission.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSearch = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(false);
    setHasError(false);

    const form = event.currentTarget;
    if (searchTermValue.length === 0) {
      form.reset();
      setHasError(false);
      setSearchResults(null);
      return;
    }

    if (searchTermValue.length < 3) {
      setErrorMessage(translateServerResponse('Please type at least 3 characters', i18n.language));
      setHasError(true);
      return;
    }

    const searched: boolean = await searchTerm(searchTermValue);
    if (searched) {
      form.reset();
    }
  };

  const loadTasks = async (filter: string): Promise<void> => {
    try {
      const response: TaskResponse[] = await api.getJSON(`${ApiConfig.homeUrl}/tasks/filter/${filter}`);
      const result: HomeSearchResponse = {
        tasks: response,
        notes: []
      };
      setSearchResults(result);
      setLastSearch(`tagClick#${filter}`);
    }
    catch (e) {
      handleError(e);
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

  const reDoLastSearch = () => {
    if (lastSearch.startsWith('textSearch#')) {
      searchTerm(lastSearch.substring(11));
    }
    else if (lastSearch.startsWith('tagClick#')) {
      loadTasks(lastSearch.substring(9));
    }
  };

  /**
   * Mark a task as done or undone.
   *
   * @param {TaskResponse} task The task to be marked as done or undone.
   */
  const markAsDone = async (task: TaskResponse): Promise<void> => {
    try {
      const updatedTask = {
        ...task,
        done: !task.done
      };
      await api.patchJSON(`${ApiConfig.tasksUrl}/${task.id}`, updatedTask);
      reDoLastSearch();
    }
    catch (e) {
      handleError(e);
    }
  };

  /**
   * Delete a task.
   *
   * @param {number} taskIdParam The task ID to be deleted.
   */
  const deleteTask = async (taskIdParam: number) => {
    try {
      await api.deleteNoContent(`${ApiConfig.tasksUrl}/${taskIdParam}`);
      reDoLastSearch();
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
      reDoLastSearch();
    }
    catch (e) {
      handleError(e);
    }
  };

  const handleCloseModal = () => setShowMarkdownView(false);

  useEffect(() => {
    handleDefaultLang();
    setName(user?.name ? user?.name : 'User');
    loadTags();
  }, [user]);

  useEffect(() => {}, [searchResults]);

  return (
    <Container fluid>
      <ContentHeader
        h1TextRegular={t('home_welcome_title')}
        h1TextBold={name}
        subtitle="Welcome to TaskNote! Get ready to complete your pending tasks"
        h2BlackText="Start Your Day, Be"
        h2GreenText="Productive"
        isHomeComponent
      />

      <Row className="mb-4">
        <Col xs={12}>
          <Card>
            <Card.Body>

              <AlertError
                errorMessage={errorMessage}
                onClose={() => {
                  setErrorMessage('');
                  setHasError(false);
                  setValidated(false);
                }}
              />

              <Form noValidate validated={validated} onSubmit={handleSearch}>
                <InputGroup className={`me-auto ${hasError ? 'is-invalid border border-danger rounded' : ''}`}>
                  <InputGroup.Text>
                    <Search />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    id="search_term"
                    name="search_term"
                    placeholder="Search tasks & notes"
                    value={searchTermValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchTermValue(e.target.value);
                    }}
                  />
                </InputGroup>

                <Row className="mt-2">
                  <Col xs={12}>
                    <HomeFilterButton
                      text="🔥 High Priority"
                      type="high"
                      onClick={() => loadTasks('high')}
                    />
                    <HomeFilterButton
                      text="All tasks"
                      type="all"
                      onClick={() => loadTasks('all')}
                    />
                    {tags.map((tag: string) => (
                      <HomeFilterButton
                        key={tag}
                        text={`#${tag}`}
                        type="tag"
                        onClick={() => loadTasks(tag)}
                      />
                    ))}
                    <HomeFilterButton
                      text="Clear result"
                      type="tag"
                      onClick={() => setSearchResults(null)}
                    />
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {searchResults && (
          <Col xs={12}>

            <Card className="mt-3">
              <Card.Body>
                <SearchResults
                  results={searchResults.tasks}
                  taskAction={(action: string, task: TaskResponse) => {
                    if (action === 'done') {
                      markAsDone(task);
                    }
                    else if (action === 'edit') {
                      navigate(`/tasks/edit/${task.id}?backTo=home`);
                    }
                    else if (action === 'delete') {
                      deleteTask(task.id);
                    }
                  }}
                />
              </Card.Body>
            </Card>

            <Card className="mt-3">
              <Card.Body>
                <SearchNoteResults
                  results={searchResults.notes}
                  noteAction={(action: string, note: NoteResponse) => {
                    if (action === 'edit') {
                      navigate(`/notes/edit/${note.id}?backTo=home`);
                    }
                    else if (action === 'delete') {
                      deleteNote(note.id);
                    }
                    else if (action === 'open') {
                      setModalTitle(note.title);
                      setModalContent(note.description);
                      setShowMarkdownView(true);
                    }
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      <Row className="mb-4">
        <Col xs={12} lg={6} className="mb-4">
          <CompletedTasks />
        </Col>
        <Col xs={12} lg={6}>
          <TaskProgress />
        </Col>
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
