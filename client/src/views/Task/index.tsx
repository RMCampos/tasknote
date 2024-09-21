import React, { useEffect, useState } from 'react';
import {
  Alert, Button, Card, Col, Container, Form, Row, Table
} from 'react-bootstrap';
import {
  addTaskRequest,
  deleteTaskRequest,
  updateTaskDoneRequest
} from '../../api-service/taskService';
import TaskNoteRequest from '../../types/TaskNoteRequest';
import { TaskResponse } from '../../types/TaskResponse';
import './style.css';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';

/**
 *
 */
function Task(): JSX.Element {
  const [validated, setValidated] = useState<boolean>(true);
  const [formInvalid, setFormInvalid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tasks, setTasks] = useState<TaskResponse[]>([]);

  const handleError = (e: unknown): void => {
    if (typeof e === 'string') {
      setErrorMessage(e);
      setFormInvalid(true);
    } else if (e instanceof Error) {
      setErrorMessage(e.message);
      setFormInvalid(true);
    }
  };

  const loadTasks = async () => {
    const tasksFetched: TaskResponse[] | Error = await api.getJSON(ApiConfig.tasksUrl);
    if (tasksFetched instanceof Error) {
      handleError(tasksFetched);
    } else {
      setTasks(tasksFetched);
    }
  };

  const addTask = async (desc: string, url?: string): Promise<boolean> => {
    const payload: TaskNoteRequest = {
      description: desc,
      urls: url ? [url] : []
    };
    const response = await addTaskRequest(payload);

    if ('id' in response) {
      loadTasks();
      return true;
    }
    handleError(response);

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
    const added: boolean = await addTask(form.description.value, form.url.value);
    if (added) {
      form.reset();
    }
  };

  const markAsDone = async (task: TaskResponse) => {
    try {
      await updateTaskDoneRequest(task.id, !task.done);
      loadTasks();
    } catch (e) {
      handleError(e);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await deleteTaskRequest(taskId);
      loadTasks();
    } catch (e) {
      handleError(e);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <Container>
      <Row className="mt-3">
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Card.Title>Add task</Card.Title>

              {formInvalid ? (
                <Alert variant="danger">
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
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Done</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task: TaskResponse) => (
                <tr key={`task-${task.id}`}>
                  <td className={task.done ? 'text-done' : ''}>{task.id}</td>
                  <td className={task.done ? 'text-done' : ''}>{task.description}</td>
                  <td className={task.done ? 'text-done' : ''}>{task.done ? 'Yes' : 'No'}</td>
                  <td className={task.done ? 'text-done' : ''}>
                    {task.urls.length > 0 ? (
                      <a href={`${task.urls[0].url}`}>Link</a>
                    ) : '-'}
                  </td>
                  <td className={task.done ? 'text-done' : ''}>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => markAsDone(task)}
                    >
                      {task.done ? 'Undone' : 'Done'}
                    </Button>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default Task;
