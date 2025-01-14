import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row
} from 'react-bootstrap';
import {
  ArrowUpSquare,
  ArrowUpSquareFill,
  CalendarCheck,
  CheckSquare,
  PencilFill,
  Square
} from 'react-bootstrap-icons';
import TaskNoteRequest from '../../types/TaskNoteRequest';
import { TaskResponse, TaskUrlResponse } from '../../types/TaskResponse';
import { useTranslation } from 'react-i18next';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';
import { translateServerResponse, translateTaskResponse } from '../../utils/TranslatorUtils';
import './style.css';

type TaskAction = 'add' | 'edit';

/**
 *
 */
function Task(): React.ReactNode {
  const [validated, setValidated] = useState<boolean>(false);
  const [formInvalid, setFormInvalid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [taskId, setTaskId] = useState<number>(0);
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskUrl, setTaskUrl] = useState<string>('');
  const [taskUrlId, setTaskUrlId] = useState<number>(0);
  const [taskDone, setTaskDone] = useState<boolean>(false);
  const [action, setAction] = useState<TaskAction>('add');
  const [dueDate, setDueDate] = useState<string>('');
  const [highPriority, setHighPriority] = useState<boolean>(false);
  const { i18n, t } = useTranslation();

  const handleError = (e: unknown): void => {
    if (typeof e === 'string') {
      setErrorMessage(translateServerResponse(e, i18n.language));
      setFormInvalid(true);
    }
    else if (e instanceof Error) {
      setErrorMessage(translateServerResponse(e.message, i18n.language));
      setFormInvalid(true);
    }
  };

  const loadTasks = async () => {
    try {
      const tasksFetched: TaskResponse[] = await api.getJSON(ApiConfig.tasksUrl);
      tasksFetched.sort((t1, t2) => {
        if (t1.done === t2.done) {
          return 0;
        }
        return t1.done ? 1 : -1;
      });
      setTasks(translateTaskResponse(tasksFetched, i18n.language));
    }
    catch (e) {
      handleError(e);
    }
  };

  const addTask = async (payload: TaskNoteRequest): Promise<boolean> => {
    try {
      await api.postJSON(ApiConfig.tasksUrl, payload);
      loadTasks();
      return true;
    }
    catch (e) {
      handleError(e);
    }

    return false;
  };

  const submitEditTask = async (payload: TaskResponse): Promise<boolean> => {
    try {
      await api.patchJSON(`${ApiConfig.tasksUrl}/${payload.id}`, payload);
      loadTasks();
      return true;
    }
    catch (e) {
      handleError(e);
    }
    return false;
  };

  const resetInputs = () => {
    setTaskId(0);
    setTaskDescription('');
    setTaskDone(false);
    setTaskUrl('');
    setTaskUrlId(0);
    setDueDate('');
    setHighPriority(false);

    setAction('add');
    setValidated(false);
    setFormInvalid(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setFormInvalid(true);
      setErrorMessage(translateServerResponse('Please fill in all the fields', i18n.language));
      return;
    }

    setFormInvalid(false);

    if (action === 'add') {
      const addPayload: TaskNoteRequest = {
        description: form.description.value.trim(),
        urls: form.url.value ? [form.url.value] : [],
        dueDate: form.dueDate.value ? form.dueDate.value : null,
        highPriority: highPriority
      };

      const added: boolean = await addTask(addPayload);
      if (added) {
        form.reset();
        resetInputs();
      }
    }
    else if (action === 'edit') {
      const urls: TaskUrlResponse[] = [];
      if (taskUrlId) {
        urls.push({ url: '', id: taskUrlId });
      }
      if (taskUrl) {
        urls.push({ url: taskUrl, id: null });
      }

      const editPayload: TaskResponse = {
        id: taskId,
        description: form.description.value.trim(),
        done: taskDone,
        highPriority: highPriority,
        dueDate: form.dueDate.value ? form.dueDate.value : null,
        dueDateFmt: '',
        lastUpdate: '',
        urls
      };

      const edited: boolean = await submitEditTask(editPayload);
      if (edited) {
        form.reset();
        resetInputs();
      }
    }
  };

  const markAsDone = async (task: TaskResponse) => {
    try {
      const updatedTask = {
        ...task,
        done: !task.done
      };
      await api.patchJSON(`${ApiConfig.tasksUrl}/${task.id}`, updatedTask);
      loadTasks();
    }
    catch (e) {
      handleError(e);
    }
  };

  const editTask = async (task: TaskResponse) => {
    setTaskId(task.id);
    setTaskDescription(task.description);
    setTaskUrl(task.urls.length ? task.urls[0].url : '');
    setTaskUrlId(task.urls.length ? task.urls[0].id || 0 : 0);
    setTaskDone(task.done);
    setDueDate(task.dueDate);
    setHighPriority(task.highPriority);
    setAction('edit');
  };

  const deleteTask = async (taskIdParam: number) => {
    try {
      await api.deleteNoContent(`${ApiConfig.tasksUrl}/${taskIdParam}`);
      loadTasks();
    }
    catch (e) {
      handleError(e);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <Container>
      {/* Form to add, edit and save tasks */}
      <Row className="mt-3">
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Card.Title>{t('task_form_title')}</Card.Title>

              {formInvalid
                ? (
                    <Alert variant="danger">
                      { errorMessage }
                    </Alert>
                  )
                : null}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3" controlId="task-form-description">
                      <Form.Label>{t('task_form_desc_label')}</Form.Label>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          <PencilFill />
                        </InputGroup.Text>
                        <Form.Control
                          required
                          type="text"
                          name="description"
                          placeholder={t('task_form_desc_placeholder')}
                          value={taskDescription}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setTaskDescription(e.target.value);
                          }}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3" controlId="task-form-url">
                      <Form.Label>{t('task_form_url_label')}</Form.Label>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>@</InputGroup.Text>
                        <Form.Control
                          required={false}
                          type="text"
                          name="url"
                          placeholder={t('task_form_url_placeholder')}
                          value={taskUrl}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setTaskUrl(e.target.value);
                          }}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3" controlId="task-form-due-date">
                      <Form.Label>{t('task_form_duedate_label')}</Form.Label>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          <CalendarCheck />
                        </InputGroup.Text>
                        <Form.Control
                          required={false}
                          type="text"
                          name="dueDate"
                          placeholder={t('task_form_duedate_placeholder')}
                          value={dueDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setDueDate(e.target.value);
                          }}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Check
                  type="switch"
                  id="high-priority-input"
                  label="High priority"
                  className="mb-3"
                  name="highPriority"
                  checked={highPriority}
                  onChange={() => setHighPriority(!highPriority)}
                />

                <Button variant="primary" type="submit">
                  {t('task_form_submit')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Tasks added */}
      <Row className="mt-3">
        <Col xs={12}>
          {tasks.map((task: TaskResponse) => (
            <Card key={task.id.toString()} className="my-2">
              <Card.Body>
                <Card.Title>
                  {task.highPriority && (
                    <>
                      {task.done
                        ? <ArrowUpSquareFill onClick={() => markAsDone(task)} className="task-icon" />
                        : <ArrowUpSquare onClick={() => markAsDone(task)} className="task-icon" />}
                      <span className={`${task.done ? '' : 'priority-high'}`}>
                        {task.done ? '' : 'HIGH'}
                      </span>
                    </>
                  )}
                  {!task.highPriority && (
                    <>
                      {task.done
                        ? <CheckSquare onClick={() => markAsDone(task)} className="task-icon" />
                        : <Square onClick={() => markAsDone(task)} className="task-icon" />}
                      <span className={`${task.done ? '' : 'priority-normal'}`}>
                        {task.done ? '' : 'NORMAL'}
                      </span>
                    </>
                  )}
                  {task.done && (
                    <span className="priority-done">DONE</span>
                  )}
                  {task.description}
                </Card.Title>
                <Row>
                  <Col xs={6}>
                    {task.dueDateFmt && (
                      <>
                        <span className="task-last-update">
                          {task.dueDateFmt}
                        </span>
                        <span className="task-pipe">|</span>
                      </>
                    )}
                    {task.urls.length > 0 && (
                      <>
                        <span className="task-last-update">
                          <a href={task.urls[0].url}>URL</a>
                        </span>
                        <span className="task-pipe">|</span>
                      </>
                    )}
                    <span className="task-last-update">{task.lastUpdate}</span>
                  </Col>
                  <Col xs={6} className="text-end">
                    {!task.done && (
                      <>
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => editTask(task)}
                          className=""
                        >
                          {t('task_table_action_edit')}
                        </Button>
                        <span className="task-pipe">|</span>
                      </>
                    )}
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => deleteTask(task.id)}
                      className="btn-action"
                    >
                      {t('task_table_action_delete')}
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default Task;
