import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import QueueList from './QueueList';
import QueueModal from './QueueModal';

import '../styles/App.css';
import ConfirmationModal from './ConfirmationModal';

const DELETE_CONFIRMATION = (name) => `Are you sure you want to delete the Queue: ${name}?`;

function App() {
  const [queues, setQueues] = useState([]);
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const deleteRef = useRef();

  const addQueue = (name, color) => {
    const newQueues = queues.slice(0);

    const newQueue = {
      name,
      color,
      id: uuidv4(),
      completedTasks: [],
      pendingTasks: [],
    };

    newQueues.push(newQueue);
    setQueues(newQueues);

    // TODO: update backend/client
  };

  const onClickDeleteQueue = (e, id) => {
    const idMatch = queues.filter(queue => queue.id === id);
    if(idMatch.length > 0) {
      const queueToDelete = idMatch[0];
      deleteRef.current = queueToDelete;

      setShowConfirmationModal(true);
    }
  };

  const deleteQueueAction = (actionConfirmed) => {
    setShowConfirmationModal(false);

    if(actionConfirmed) {
      const newQueues = queues.filter(queue => queue.id !== deleteRef.current.id);
      setQueues(newQueues);

      // TODO: update backend/client
    }

    deleteRef.current = null;
  };

  const onClickEditQueue = (e, id) => {
    console.log(`edit e: ${e.target}, id: ${id}`);
  };

  const onClickAddQueue = () => setShowQueueModal(true);
  
  const onCancelQueueModal = () => setShowQueueModal(false);
  const onAcceptQueueModal = (name) => {
    const color = '#4287f5'; // TODO: implement as parameter

    addQueue(name, color);
    // TODO: add edit functionality!!

    setShowQueueModal(false);
  };

  return (
    <div className="App">
      <QueueList
        queues={queues}
        addButtonDisabled={showQueueModal}
        onClickAddQueue={onClickAddQueue}
        onClickDeleteQueue={onClickDeleteQueue}
        onClickEditQueue={onClickEditQueue}
      />
      { showConfirmationModal &&
        <ConfirmationModal
          prompt={DELETE_CONFIRMATION(deleteRef.current.name)}
          onConfirm={() => deleteQueueAction(true)}
          onCancel={() => deleteQueueAction(false)}
        />
      }
      { showQueueModal &&
        <QueueModal
          onAccept={onAcceptQueueModal}
          onClose={onCancelQueueModal}
        />
      }
    </div>
  );
}

export default App;
