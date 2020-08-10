import React, { useState } from 'react';
import PropTypes from 'prop-types';

import '../styles/TaskModal.css';

const LABEL_QUEUE_SELECT = 'Choose a Queue:';
const LABEL_INPUT_TASK = 'Enter task';

function TaskModal({ taskInfo = {}, queueDropdownOptions, onConfirm, onCancel }) {
  const [queueId, setQueueId] = useState(taskInfo.queueId || queueDropdownOptions[0].id);
  const [text, setText] = useState(taskInfo.text || '');

  const onChangeDropdown = (event) => {
    if(queueId !== event.target.value) {
      setQueueId(event.target.value);
    }
  }

  const onChangeText = (event) => {
    setText(event.target.value);
  };

  return (
    <div className='TaskModal'>
      { !taskInfo.queueId &&
        <>
          <label htmlFor='queue-select'>{LABEL_QUEUE_SELECT}</label>
          <select id='queue-select' onChange={onChangeDropdown}>
            {
              queueDropdownOptions.map((queue) =>
                <option key={queue.id} value={queue.id}>{queue.name}</option>
              )
            }
          </select>
        </>
      }
      <label>{LABEL_INPUT_TASK}</label>
      <input
        type='text'
        value={text}
        onChange={onChangeText}
      />
      <button onClick={() => onConfirm(queueId, text)}>
        <i className='check icon' />
      </button>
      <button onClick={onCancel}>
        <i className='delete icon' />
      </button>
    </div>
  );
};

TaskModal.propTypes = {
  taskInfo: PropTypes.shape({
    queueId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
  queueDropdownOptions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  })).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default TaskModal;
