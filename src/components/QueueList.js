import React from 'react';

import Queue from './Queue.js';
import TaskList from './TaskList';

import '../styles/QueueList.css';

import useQueues from '../logic/useQueues.js';

function QueueList() {
  const {
    queues,
    actionCreateQueue,
    actionEditQueue,
    actionDeleteQueue,
  } = useQueues();

  return (
    <div className='QueueList'>
        <div className='QueueBar'>
          {
            queues.map((queue) => (
              <Queue
                key={queue.id}
                queue={queue}
                handleCreate={actionCreateQueue}
                handleEdit={actionEditQueue}
                handleDelete={actionDeleteQueue}
              />
            ))
          }
          <Queue
            handleCreate={actionCreateQueue}
            handleEdit={actionEditQueue}
            handleDelete={actionDeleteQueue}
          />
        </div>
        <div className='mainPanel'>
        </div>
    </div>
  );
};

export default QueueList;
