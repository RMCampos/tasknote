import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Row
} from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { TaskResponse } from '../../types/TaskResponse';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';
import { translateServerResponse, translateTaskResponse } from '../../utils/TranslatorUtils';
import TaskTimeLeft from '../../components/TaskTimeLeft';
import TaskUrl from '../../components/TaskUrl';
import TaskTag from '../../components/TaskTag';
import TaskTitle from '../../components/TaskTitle';
import './style.css';

/**
 * The Task component is a view that displays a list of tasks.
 *
 * @returns {React.ReactNode} The Task component
 */
function Task(): React.ReactNode {
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [savedTasks, setSavedTasks] = useState<TaskResponse[]>([]);
  const [filterText, setFilterText] = useState<string>('');
  const { i18n, t } = useTranslation();

  /**
   * Handle errors from server requests and translate them if required.
   *
   * @param {unknown} e The error to be handled.
   */
  const handleError = (e: unknown): void => {
    if (typeof e === 'string') {
      setErrorMessage(translateServerResponse(e, i18n.language));
      setDisplayError(true);
    }
    else if (e instanceof Error) {
      setErrorMessage(translateServerResponse(e.message, i18n.language));
      setDisplayError(true);
    }
  };

  /**
   * Load tasks from the server.
   */
  const loadTasks = async () => {
    try {
      const tasksFetched: TaskResponse[] = await api.getJSON(ApiConfig.tasksUrl);
      tasksFetched.sort((t1, t2) => {
        if (t1.done === t2.done) {
          return 0;
        }
        return t1.done ? 1 : -1;
      });
      const translated = translateTaskResponse(tasksFetched, i18n.language);
      setSavedTasks([...translated]);
      setTasks([...translated]);
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

  /**
   * Delete a task.
   *
   * @param {number} taskIdParam The task ID to be deleted.
   */
  const deleteTask = async (taskIdParam: number) => {
    try {
      await api.deleteNoContent(`${ApiConfig.tasksUrl}/${taskIdParam}`);
      loadTasks();
    }
    catch (e) {
      handleError(e);
    }
  };

  /**
   * Filter tasks by a given text.
   */
  const filterTasks = (text: string): void => {
    setFilterText(text);

    if (!text) {
      setTasks([...savedTasks]);
      return;
    }

    const filteredTasks = savedTasks.filter((task: TaskResponse) => {
      return task.description.toLowerCase().includes(text.toLowerCase());
    });

    setTasks([...filteredTasks]);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <Container>
      {/* Tasks added */}
      <Row className="main-margin">
        <Col xs={12}>
          {displayError
            ? (
                <Alert variant="danger">
                  { errorMessage }
                </Alert>
              )
            : null}
        </Col>
      </Row>

      <Row>
        <Col xs={9}>
          <Form.Control
            type="text"
            id="search_term"
            size="lg"
            name="search_term"
            placeholder="Filter tasks"
            value={filterText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => filterTasks(e.target.value)}
          />
        </Col>
        <Col xs={3}>
          <NavLink to="/tasks/new">
            <div className="d-grid gap-2">
              <Button variant="primary" size="lg" type="button" className="d-grip">
                Add task
              </Button>
            </div>
          </NavLink>
        </Col>
      </Row>

      <Row className="mt-3">
        {tasks.map((task: TaskResponse) => (
          <Col xs={12} key={task.id.toString()}>
            <Card key={task.id.toString()} className="task-card">
              <Card.Body>
                <Row>
                  <Col xs={10}>
                    <Card.Title>
                      <TaskTitle
                        title={task.description}
                        highPriority={task.highPriority}
                        done={task.done}
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
                        <Dropdown.Item as="button" onClick={() => deleteTask(task.id)}>
                          {t('task_table_action_delete')}
                        </Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => markAsDone(task)}>
                          {task.done ? t('task_table_action_undone') : t('task_table_action_done')}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>

                {task.dueDateFmt && (
                  <TaskTimeLeft text={task.dueDateFmt} done={task.done} />
                )}
                {task.urls.length > 0 && (
                  <TaskUrl url={task.urls[0]} />
                )}
              </Card.Body>
              <Card.Footer className="task-card-footer">
                <TaskTag tag={task.tag} lastUpdate={task.lastUpdate} />
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Task;
