import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

import '../styles/ConfirmationModal.css';

function ConfirmationModal({ prompt, onConfirm, onCancel }) {
  return (
    <div>
      {prompt}
      <Button icon onClick={onConfirm}>
        <Icon name='check' />
      </Button>
      <Button icon onClick={onCancel}>
        <Icon name='delete' />
      </Button>
    </div>
  );
}

ConfirmationModal.propTypes = {
  prompt:PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationModal;
