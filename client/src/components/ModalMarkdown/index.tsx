import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './style.css';

type Props = {
  show: boolean;
  title: string;
  markdownText: string;
  onHide: () => void;
};

/**
 * Renders a modal with Markdown format text.
 *
 * @param {Props} props The ModalMarkdown props with show, title and text.
 * @param {boolean} props.show Defines when to display the modal.
 * @param {string} props.title The modal title to be displayed.
 * @param {string} props.markdownText The Markdown text to be rendered.
 * @param {Function} props.onHide The function to be called when closing the modal.
 * @returns {React.ReactNode} the Markdown component rendered.
 */
const ModalMarkdown: React.FC<Props> = (props: Props): React.ReactNode => {
  return props.show
    ? (
        <Modal
          show={props.show}
          onHide={props.onHide}
          backdrop="static"
          keyboard={false}
          size="xl"
          aria-labelledby="markdown-modal-content"
        >
          <Modal.Header closeButton>
            <Modal.Title
              id="markdown-modal-content"
              data-testid="modal-header-title"
            >
              {props.title === '' ? 'No title' : props.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="markdown-modal">
            <Markdown remarkPlugins={[remarkGfm]}>{props.markdownText}</Markdown>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={props.onHide}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )
    : null;
};

export default ModalMarkdown;
