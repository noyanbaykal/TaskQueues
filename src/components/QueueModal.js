import React, { useState } from 'react';
import PropTypes from 'prop-types';

import '../styles/QueueModal.css';

const INPUT_FIELD_INFO_NAME = 'Enter queue name';

function QueueModal({ queue = {}, onConfirm, onCancel }) {
  const [name, setName] = useState(queue.name || '');

  return (
    <div>
      <label>{INPUT_FIELD_INFO_NAME}</label>
      <input
        type='text'
        value={name}
        onChange={event => setName(event.target.value)}
      />
      <button onClick={() => onConfirm(name)}>&#10003;</button>
      <button onClick={onCancel}>&#10006;</button>
    </div>
  );
};

QueueModal.propTypes = {
  queue: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default QueueModal;
