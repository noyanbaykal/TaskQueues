import React, { useState } from 'react';

import '../styles/QueueEdit.css';

/*
<i className="gg-trash"></i>
<i className="gg-pen"></i>
*/

const PLACEHOLDER_NAME = 'Enter category name';

function QueueEdit({ onAccept, onClose }) {
  const [name, setName] = useState('');

  // TODO: need input checks!

  return (
    <div>
      <label>{PLACEHOLDER_NAME}</label>
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

export default QueueEdit;
