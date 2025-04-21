import React from 'react';
import { ListGroup } from 'react-bootstrap';
import ExternalLinkIcon from '../../assets/icons8-external-link-30.png';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { NoteResponse } from '../../types/NoteResponse';

interface SearchResultsProps {
  results: NoteResponse[];
  noteAction: (action: string, task: NoteResponse) => void;
}

export const SearchNoteResults: React.FC<SearchResultsProps> = ({ results, noteAction }) => {
  return (
    <>
      {results.length === 0
        ? (
            <p className="text-muted fst-italic search-result-item-title">No notes found</p>
          )
        : (
            <>
              <p className="text-muted fst-italic search-result-item-title">
                {results.length}
                {' '}
                notes(s) found
              </p>
              <ListGroup className="mt-2 d-flex flex-column">
                {results.map((note: NoteResponse) => (
                  <ListGroup.Item key={note.id} className="search-result-item d-flex justify-content-between align-items-center">
                    {note.title}
                    <small>
                      <a
                        href="#"
                        className="ms-2"
                        title="Open note"
                        onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
                          e.preventDefault();
                          e.stopPropagation();
                          noteAction('open', note);
                        }}
                        data-testid={`note-home-result-open-${note.id}`}
                      >
                        Open
                      </a>
                    </small>
                    {note.url && note.url.length > 0 && (
                      <a href={note.url} target="_blank" rel="noreferrer" className="task-note-external-link">
                        <img src={ExternalLinkIcon} width={20} alt="external link" />
                      </a>
                    )}

                    <div className="d-flex gap-2 ms-auto">
                      <a
                        href="#"
                        onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
                          e.preventDefault();
                          e.stopPropagation();
                          noteAction('edit', note);
                        }}
                      >
                        <PencilSquare />
                      </a>
                      <a
                        href="#"
                        onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
                          e.preventDefault();
                          e.stopPropagation();
                          noteAction('delete', note);
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
