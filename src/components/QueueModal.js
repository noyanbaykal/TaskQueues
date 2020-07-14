import React, { useState } from 'react';

import '../styles/QueueModal.css';

const INPUT_FIELD_INFO_NAME = 'Enter category name';

function QueueModal({ selectedQueue = {}, onConfirm, onCancel }) {
  const [name, setName] = useState(selectedQueue.name || '');

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

export default QueueModal;
