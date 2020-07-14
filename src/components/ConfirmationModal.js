import React from 'react';

import '../styles/ConfirmationModal.css';

function ConfirmationModal({ prompt, onConfirm, onCancel }) {
  return (
    <div>
      {prompt}
      <button onClick={onConfirm}>&#10003;</button>
      <button onClick={onCancel}>&#10006;</button>
    </div>
  );
}

export default ConfirmationModal;
