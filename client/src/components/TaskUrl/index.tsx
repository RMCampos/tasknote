import React from 'react';
import { At } from 'react-bootstrap-icons';

interface Props {
  readonly url: string;
}

/**
 * Renders the TaskUrl component, displaying a URL with an icon.
 *
 * @param {Props} props - The props for the component.
 * @param {string} props.url - The URL to be displayed.
 * @returns {React.ReactNode} The rendered TaskUrl component.
 */
function TaskUrl(props: React.PropsWithChildren<Props>): React.ReactNode {
  let displayUrl = props.url.substring(props.url.indexOf('://') + 3);
  if (displayUrl.includes('www.')) {
    displayUrl = displayUrl.substring(displayUrl.indexOf('wwww.') + 5);
  }
  const maxLength = 50;
  if (displayUrl.length > maxLength) {
    displayUrl = `${displayUrl.substring(0, maxLength)}...`;
  }

  return (
    <div className="d-block mt-1">
      <At />
      <span className="ms-2">
        <a href={props.url} rel="noreferrer">{displayUrl}</a>
      </span>
    </div>
  );
}

export default TaskUrl;
