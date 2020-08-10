import React, { useState } from 'react';
import PropTypes from 'prop-types';

import '../styles/QueueModal.css';

const INPUT_FIELD_INFO_NAME = 'Enter queue name:';
const INPUT_FIELD_INFO_COLOR = 'Enter queue color:';

const DEFAULT_COLOR = '#0000ff';
const HEX_REGEX = new RegExp('^#[0-9A-F]{6}$');
const COLOR_INPUT_STYLE = (color) => {
  color = HEX_REGEX.test(color) ? color : '#00ff00';
  
  return {
    background: `linear-gradient(90deg, white 50%, ${color} 50%)`,
  }
};

function QueueModal({ queue = {}, onConfirm, onCancel }) {
  const [name, setName] = useState(queue.name || '');
  const [color, setColor] = useState(queue.color || DEFAULT_COLOR);

  const confirmValues = () => ({
    name,
    color
  });

  return (
    <div className='QueueModal'>
      <label htmlFor='name' >{INPUT_FIELD_INFO_NAME}</label>
      <input
        id='name'
        type='text'
        value={name}
        onChange={event => setName(event.target.value)}
      />
      <label htmlFor='color' >{INPUT_FIELD_INFO_COLOR}</label>
      <input
        id='color'
        type='text'
        title='Enter Hex'
        value={color}
        onChange={event => setColor(event.target.value)}
        style={COLOR_INPUT_STYLE(color)}
      />
      <button onClick={() => onConfirm(confirmValues())}>
        <i className='check icon'/>
      </button>
      <button onClick={onCancel}>
        <i className='delete icon' />
      </button>
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
