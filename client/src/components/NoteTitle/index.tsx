import React from 'react';

interface Props {
  readonly title: string;
}

/**
 * Renders the TaskTitle component, displaying an icon and the task title.
 *
 * @param {Props} props - The props for the component.
 * @param {string} [props.title] - The title for the task.
 * @returns {React.ReactNode} The rendered TaskTitle component.
 */
function NoteTitle(props: React.PropsWithChildren<Props>): React.ReactNode {
  return (
    <span className="task-title-icon">
      <span className="poppins-semibold">
        {props.title}
      </span>
    </span>
  );
}

export default NoteTitle;
