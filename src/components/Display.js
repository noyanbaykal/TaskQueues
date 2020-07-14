import React from 'react';

import QueueList from './QueueList';
import QueueModal from './QueueModal';
import ConfirmationModal from './ConfirmationModal';

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
    actionAcceptQueueModal,
    actionCancelQueueModal,
    actionDeleteQueue,
  } = useQueues();

  return (
    <div className="Display">
      <QueueList
        queues={queues}
        addButtonDisabled={showQueueModal}
        onClickAddQueue={onClickAddQueue}
        onClickDeleteQueue={onClickDeleteQueue}
        onClickEditQueue={onClickEditQueue}
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
          onAccept={actionAcceptQueueModal}
          onClose={actionCancelQueueModal}
        />
      }
    </div>
  );
};

export default Display;
