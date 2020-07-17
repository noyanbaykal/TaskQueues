import React from 'react';

import QueueList from './QueueList';
import QueueModal from './QueueModal';
import ConfirmationModal from './ConfirmationModal';
import TaskList from './TaskList';

import useQueues from '../logic/useQueues.js';

import '../styles/Display.css';

function Display() {
  const {
    DELETE_CONFIRMATION,
    queues,
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
    <div className="Display">
      <QueueList
        queues={queues}
        addButtonDisabled={showQueueModal}
        onClickAddQueue={onClickAddQueue}
        onClickEditQueue={onClickEditQueue}
        onClickDeleteQueue={onClickDeleteQueue}
      />
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
          <TaskList />
      }
    </div>
  );
};

export default Display;
