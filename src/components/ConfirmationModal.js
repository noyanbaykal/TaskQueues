import React from 'react';
import PropTypes from 'prop-types';

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

ConfirmationModal.propTypes = {
  prompt:PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationModal;
