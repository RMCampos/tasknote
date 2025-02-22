import React from 'react';
import { CalendarCheck } from 'react-bootstrap-icons';

interface Props {
  text: string;
  done: boolean;
}

/**
 * Renders the TaskTimeLeft component if the task is not done, displaying
 * a calendar icon and the time left for the task.
 *
 * @param {Props.done} props.done - Boolean value indicating if the task is done.
 * @param {Props.text} props.text - The time left for the task.
 * @returns
 */
function TaskTimeLeft(props: Props): React.ReactNode | null {
  return props.done
    ? null
    : (
        <div className="d-block">
          <CalendarCheck />
          <span className="ms-2 poppins-regular">
            {props.text}
          </span>
        </div>
      );
}

export default TaskTimeLeft;
