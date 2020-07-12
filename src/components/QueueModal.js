import React, { useState } from 'react';

import '../styles/QueueModal.css';

const INPUT_FIELD_INFO_NAME = 'Enter category name';

function QueueModal({ onAccept, onClose }) {
  const [name, setName] = useState('');

  // TODO: need input checks!

  return (
    <div>
      <label>{INPUT_FIELD_INFO_NAME}</label>
      <input
        type='text'
        value={name}
        onChange={event => setName(event.target.value)}
      />
      <button onClick={() => onAccept(name)}>&#10003;</button>
      <button onClick={onClose}>&#10006;</button>
    </div>
  );
};

export default QueueModal;
