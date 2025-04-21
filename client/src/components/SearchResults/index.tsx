import React from 'react';
import { TaskResponse } from '../../types/TaskResponse';
import { ListGroup } from 'react-bootstrap';
import ExternalLinkIcon from '../../assets/icons8-external-link-30.png';
import { Check2Square, PencilSquare, Trash } from 'react-bootstrap-icons';

interface SearchResultsProps {
  results: TaskResponse[];
  taskAction: (action: string, task: TaskResponse) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, taskAction }) => {
  return (
    <>
      {results.length === 0
        ? (
            <p className="text-muted fst-italic search-result-item-title">No tasks found</p>
          )
        : (
            <>
              <p className="text-muted fst-italic search-result-item-title">
                {results.length}
                {' '}
                task(s) found
              </p>
              <ListGroup className="mt-2 d-flex flex-column">
                {results.map((task: TaskResponse) => (
                  <ListGroup.Item key={task.id} className="search-result-item d-flex justify-content-between align-items-center">
                    {task.description}
                    {task.urls && task.urls.length > 0 && (
                      <a href={task.urls[0]} target="_blank" rel="noreferrer" className="task-note-external-link">
                        <img src={ExternalLinkIcon} width={20} alt="external link" />
                      </a>
                    )}
                    {task.dueDateFmt && (
                      <span className="ms-1" title={task.dueDateFmt}>📅</span>
                    )}

                    <div className="d-flex gap-2 ms-auto">
                      <a
                        href="#"
                        data-testid={`task-home-result-done-${task.id}`}
                        onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
                          e.preventDefault();
                          e.stopPropagation();
                          taskAction('done', task);
                        }}
                      >
                        <Check2Square />
                      </a>
                      <a
                        href="#"
                        data-testid={`task-home-result-edit-${task.id}`}
                        onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
                          e.preventDefault();
                          e.stopPropagation();
                          taskAction('edit', task);
                        }}
                      >
                        <PencilSquare />
                      </a>
                      <a
                        href="#"
                        data-testid={`task-home-result-delete-${task.id}`}
                        onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
                          e.preventDefault();
                          e.stopPropagation();
                          taskAction('delete', task);
                        }}
                      >
                        <Trash />
                      </a>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
    </>
  );
};
