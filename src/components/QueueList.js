import React from 'react';

import Queue from './Queue.js';
import TaskList from './TaskList';

import useQueues from '../logic/useQueues.js';

const NO_QUEUES = 'Create a queue before adding tasks!';

function QueueList() {
  const {
    queues,
    getTaskInfos,
    getQueueDropdownOptions,
    actionCreateQueue,
    actionEditQueue,
    actionDeleteQueue,
    actionCreateTask,
    actionEditTask,
    actionDeleteTask,
    actionCompleteTask,
  } = useQueues();

  return (
    <div className='QueueList'>
      <div className='queueBar'>
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
        { queues.length < 1 &&
          <div style={{ marginBottom: '1em' }}>
            {NO_QUEUES}
          </div>
        }
        <Queue
          handleCreate={actionCreateQueue}
          handleEdit={actionEditQueue}
          handleDelete={actionDeleteQueue}
        />
      </div>
      {
        queues.length > 0 &&
          <div className='mainPanel'>
          {
            <TaskList
              taskInfos={getTaskInfos()}
              queueDropdownOptions={getQueueDropdownOptions()}
              actionCreateTask={actionCreateTask}
              actionEditTask={actionEditTask}
              actionDeleteTask={actionDeleteTask}
              actionCompleteTask={actionCompleteTask}
            />
          }
          </div>
      }
    </div>
  );
};

export default QueueList;
