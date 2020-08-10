import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import '../styles/ConfirmationModal.css';

function ConfirmationModal({ prompt, onConfirm, onCancel }) {
  return (
    <div>
      {prompt}
      <button onClick={onConfirm}>
        <Icon className='check' />
      </button>
      <button onClick={onCancel}>
        <Icon className='delete' />
      </button>
    </div>
  );
}

ConfirmationModal.propTypes = {
  prompt:PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationModal;
