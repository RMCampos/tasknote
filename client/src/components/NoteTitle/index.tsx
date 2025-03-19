import React from 'react';
import ExternalLinkIcon from '../../assets/icons8-external-link-30.png';

interface Props {
  readonly title: string;
  readonly noteUrl: string | null;
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
        {props.noteUrl && props.noteUrl.length > 0 && (
          <a href={props.noteUrl} target="_blank" rel="noreferrer" className="task-note-external-link">
            <img src={ExternalLinkIcon} width={20} alt="external link" />
          </a>
        )}
      </span>
    </span>
  );
}

export default NoteTitle;
