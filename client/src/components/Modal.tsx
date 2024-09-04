import React from 'react';

import styles from './Modal.module.css';

interface Props {
  children: React.ReactNode
}

const Modal: React.FC<{ children: React.ReactNode }> = ({ children }: Props) => {
  const closeModal = (): void => {
    const modal = document.querySelector('#modal');
    modal!.classList.add('hide');
  };

  return (
    <div>
      <div id="modal" className="hide">
        <button
          type="button"
          className={styles.fade}
          onClick={() => closeModal()}
        >
          Close
        </button>
        <div className={styles.modal}>
          <h2>Modal text</h2>
          { children }
        </div>
      </div>
    </div>
  );
};

export default Modal;
