import React from 'react';

// Interface
import { ITask } from '../interfaces/Task';

// CSS
import styles from './TaskList.module.css';

interface Props {
  taskList: ITask[];
  handleDelete(id: number): void;
  handleEdit(task: ITask): void;
}

const TaskList = ({ taskList, handleDelete, handleEdit }: Props): JSX.Element => {
  if (taskList.length) {
    return (
      <>
        {taskList.map((task) => (
          <div key={task.id} className={styles.task}>
            <div className={styles.details}>
              <h4>{task.title}</h4>
              <p>
                Difficulty:
                {task.difficulty}
              </p>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className="bi bi-pencil"
                onClick={() => { handleEdit(task); }}
              >
                Edit
              </button>
              <button
                type="button"
                className="bi bi-trash"
                onClick={() => { handleDelete(task.id); }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </>
    );
  }

  return <p>There&#39;s no task records</p>;
};

export default TaskList;
