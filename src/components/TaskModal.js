import React, { useState } from 'react';

import '../styles/TaskModal.css';

const LABEL_QUEUE_SELECT = 'Choose a Queue:';
const LABEL_INPUT_TASK = 'Enter task';

function TaskModal({ selectedTaskInfo, queueOptions, onConfirm, onCancel }) {
  const [selectedQueueId, setSelectedQueueId] = useState((selectedTaskInfo || {}).queueId || queueOptions[0].id);
  const [taskText, setTaskText] = useState((selectedTaskInfo || {}).text || '');

  const onClickDropdown = (queueId) => {
    setSelectedQueueId(queueId);
  }

  return (
    <div className='TaskModal'>
      { !selectedTaskInfo &&
        <div>
          <label htmlFor='queue-select'>{LABEL_QUEUE_SELECT}</label>
          <select id='queue-select' onChange={event => onClickDropdown(event.target.value)}>
            {
              queueOptions.map((queue) =>
                <option key={queue.id} value={queue.id}>{queue.name}</option>
              )
            }
          </select>
        </div>
      }
      <label>{LABEL_INPUT_TASK}</label>
      <input
        type='text'
        value={taskText}
        onChange={event => setTaskText(event.target.value)}
      />
      <button onClick={() => onConfirm({ selectedQueueId, taskText })}>&#10003;</button>
      <button onClick={onCancel}>&#10006;</button>
    </div>
  );
};

export default TaskModal;
