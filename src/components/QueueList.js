import React from 'react';
import Queue from './Queue.js';

import '../styles/QueueList.css';

function QueueList({ queues, addButtonDisabled, onClickAddQueue, onClickEditQueue, onClickDeleteQueue }) {
  return (
    <div className='QueueList'>
      {
        queues.map((queue) => (
          <Queue
            key={queue.id}
            queue={queue}
            onClickDeleteQueue={onClickDeleteQueue}
            onClickEditQueue={onClickEditQueue}
          />
        ))
      }
      <button className='addQueue' onClick={onClickAddQueue} disabled={addButtonDisabled}>&#43;</button>
    </div>
  );
};

export default QueueList;
