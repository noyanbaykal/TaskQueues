import React from 'react';
import Queue from './Queue.js';

import '../styles/QueueList.css';
import '../styles/gg-trash.css';
import '../styles/gg-pen.css';

function QueueList({ queues, onAddQueue, addButtonDisabled }) {
  return (
    <div className='QueueList'>
      {
        queues.map((queue) => (
          <Queue key={queue.id} {...queue}/>
        ))
      }
      <button className='addQueue' onClick={onAddQueue} disabled={addButtonDisabled}>&#43;</button>
    </div>
  );
};

export default QueueList;
