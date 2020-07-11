import React from 'react';

import Queue from './Queue.js';
import '../styles/gg-trash.css';

function QueueList({ queues }) {
  return (
    <div>
      {
        queues.map((queue) => (
          <Queue key={queue.id} {...queue}/>
        ))
      }
      <span>&#43;</span>
      <i class="gg-trash" style={{ marginLeft: '5px' }}></i>
    </div>
  );
};

export default QueueList;
