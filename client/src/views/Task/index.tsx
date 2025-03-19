import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Row
} from 'react-bootstrap';
import { PlusCircleFill, ThreeDotsVertical } from 'react-bootstrap-icons';
import { TaskResponse } from '../../types/TaskResponse';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';
import { translateServerResponse, translateTaskResponse } from '../../utils/TranslatorUtils';
import TaskTimeLeft from '../../components/TaskTimeLeft';
import TaskTag from '../../components/TaskTag';
import TaskTitle from '../../components/TaskTitle';
import ContentHeader from '../../components/ContentHeader';
import AlertError from '../../components/AlertError';
import './style.scss';

/**
 * The Task component is a view that displays a list of tasks.
 *
 * @returns {React.ReactNode} The Task component
 */
function Task(): React.ReactNode {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [savedTasks, setSavedTasks] = useState<TaskResponse[]>([]);
  const [filterText, setFilterText] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('option1');
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
      setSelectedOption('option1');
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
  const filterTasks = (text: string, radioBtnFilter?: string): void => {
    setFilterText(text);

    if (!text && !radioBtnFilter) {
      setTasks([...savedTasks]);
      return;
    }

    let filteredTasks = savedTasks.filter((task: TaskResponse) => {
      const shouldFilter = task.description.toLowerCase().includes(text.toLowerCase())
        || task.tag.toLowerCase().includes(text.toLowerCase())
        || task.urls.filter((url: string) => url.includes(text.toLowerCase())).length > 0;
      return shouldFilter;
    });

    const pending = radioBtnFilter === 'option2';
    const completed = radioBtnFilter === 'option3';
    if (pending) {
      filteredTasks = filteredTasks.filter((task: TaskResponse) => !task.done);
    }
    else if (completed) {
      filteredTasks = filteredTasks.filter((task: TaskResponse) => task.done);
    }

    setTasks([...filteredTasks]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedOption(e.target.value);
    filterTasks(filterText, e.target.value);
  };

  const getTaskClasses = (task: TaskResponse): string => {
    const classesToUse: string[] = [];
    classesToUse.push('task-card');
    classesToUse.push('shadow-lg');
    classesToUse.push('bg-light');
    if (!task.done && task.highPriority) {
      classesToUse.push('high-importance');
    }
    else if (!task.done && !task.highPriority) {
      classesToUse.push('normal-importance');
    }
    else if (task.done) {
      classesToUse.push('done-no-importance');
    }
    return classesToUse.join(' ');
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <Container>
      <ContentHeader
        h1TextRegular="All"
        h1TextBold="Tasks"
        subtitle="Be on top of your TODO list"
        h2BlackText="Create, Filter, and Easily Find"
        h2GreenText="Them"
      />

      <AlertError errorMessage={errorMessage} />

      <Row>
        <Col xs={12} sm={8} lg={9}>
          <Form.Control
            type="text"
            id="search_term"
            size="lg"
            name="search_term"
            placeholder="Filter tasks"
            value={filterText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => filterTasks(e.target.value, selectedOption)}
          />
        </Col>
        <Col xs={12} sm={4} lg={3} className="mt-3 mt-sm-0">
          <NavLink to="/tasks/new">
            <div className="d-grid">
              <button
                type="button"
                className="home-new-item task-note-btn"
              >
                <PlusCircleFill size={25} />
                Add Tasks
              </button>
            </div>
          </NavLink>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form className="mt-3 ms-1">
            <div className="d-flex gap-3">
              <Form.Check
                inline
                type="radio"
                label="All"
                name="radioGroup"
                id="radio1"
                value="option1"
                checked={selectedOption === 'option1'}
                onChange={handleChange}
                className="custom-radio-button"
              />
              <Form.Check
                inline
                type="radio"
                label="Pending"
                name="radioGroup"
                id="radio2"
                value="option2"
                checked={selectedOption === 'option2'}
                onChange={handleChange}
                className="custom-radio-button"
              />
              <Form.Check
                inline
                type="radio"
                label="Completed"
                name="radioGroup"
                id="radio3"
                value="option3"
                checked={selectedOption === 'option3'}
                onChange={handleChange}
                className="custom-radio-button"
              />
            </div>
          </Form>
        </Col>
      </Row>

      <Row className="mt-3">
        {tasks.map((task: TaskResponse) => (
          <Col xs={12} key={task.id.toString()}>
            <Card
              key={task.id.toString()}
              className={getTaskClasses(task)}
            >
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
                  <TaskTimeLeft
                    text={task.dueDateFmt}
                    done={task.done}
                    tooltip={task.dueDate}
                  />
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
