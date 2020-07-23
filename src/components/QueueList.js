import React from 'react';

import ConfirmationModal from './ConfirmationModal';
import Queue from './Queue.js';
import QueueModal from './QueueModal';
import TaskList from './TaskList';

import '../styles/QueueList.css';

import useQueues from '../logic/useQueues.js';

function QueueList() {
  const {
    DELETE_CONFIRMATION,
    queues,
    setQueues,
    selectedQueueRef,
    showQueueModal,
    showConfirmationModal,
    onClickAddQueue,
    onClickEditQueue,
    onClickDeleteQueue,
    actionQueueModal,
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
                onClickEditQueue={onClickEditQueue}
                onClickDeleteQueue={onClickDeleteQueue}
              />
            ))
          }
          <button className='addQueue' onClick={onClickAddQueue} disabled={showQueueModal}>&#43;</button>
        </div>
        <div className='mainPanel'>
          { showConfirmationModal &&
            <ConfirmationModal
              prompt={DELETE_CONFIRMATION(selectedQueueRef.current.name)}
              onConfirm={() => actionDeleteQueue(true)}
              onCancel={() => actionDeleteQueue(false)}
            />
          }
          { showQueueModal &&
            <QueueModal
              selectedQueue={selectedQueueRef.current}
              onConfirm={(name) => actionQueueModal(name)}
              onCancel={() => actionQueueModal()}
            />
          }
          {
            !showConfirmationModal && !showQueueModal &&
              <TaskList
                queues={queues}
                setQueues={setQueues}
              />
          }
        </div>
    </div>
  );
};

export default QueueList;
