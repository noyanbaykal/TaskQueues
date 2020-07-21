import React from 'react';

import '../styles/Task.css';
import '../styles/gg-trash.css';
import '../styles/gg-pen.css';

function Task({ task, onClickDeleteTask, onClickEditTask }) {
  const { text, queueId, index, color } = task;

  // TODO: show the color somehow!

  return (
    <div className='Task'>
      <div>
        {text}
      </div>
      <button onClick={(e) => onClickDeleteTask(e, queueId, index, text)}>
        <i className="gg-trash"></i>
      </button>
      <button onClick={(e) => onClickEditTask(e, queueId, index, text)}>
        <i className="gg-pen"></i>
      </button>
    </div>
  );
};

export default Task;
