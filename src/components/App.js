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
  const selectedQueueRef = useRef();

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

  const onClickDeleteQueue = (event, id) => {
    const idMatch = queues.filter(queue => queue.id === id);
    if(idMatch.length > 0) {
      const queueToDelete = idMatch[0];
      selectedQueueRef.current = queueToDelete;

      setShowConfirmationModal(true);
    }
  };

  const deleteQueueAction = (actionConfirmed) => {
    setShowConfirmationModal(false);

    if(actionConfirmed) {
      const newQueues = queues.filter(queue => queue.id !== selectedQueueRef.current.id);
      setQueues(newQueues);

      // TODO: update backend/client
    }

    selectedQueueRef.current = undefined;
  };

  const onClickEditQueue = (event, id) => {
    const idMatch = queues.filter(queue => queue.id === id);
    if(idMatch.length > 0) {
      const queueToEdit = idMatch[0];
      selectedQueueRef.current = queueToEdit;

      setShowQueueModal(true);
    }
  };

  const onClickAddQueue = () => setShowQueueModal(true);
  
  const onCancelQueueModal = () => {
    selectedQueueRef.current = undefined;
    setShowQueueModal(false);
  };

  const onAcceptQueueModal = (name) => {
    if (selectedQueueRef.current) {
      selectedQueueRef.current.name = name;

      // TODO:implement updating color

      selectedQueueRef.current = undefined;
    } else {
      const color = '#4287f5'; // TODO: implement as parameter
      addQueue(name, color);
    }

    setShowQueueModal(false);

    // TODO: update backend/client
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
          prompt={DELETE_CONFIRMATION(selectedQueueRef.current.name)}
          onConfirm={() => deleteQueueAction(true)}
          onCancel={() => deleteQueueAction(false)}
        />
      }
      { showQueueModal &&
        <QueueModal
          selectedQueue={selectedQueueRef.current}
          onAccept={onAcceptQueueModal}
          onClose={onCancelQueueModal}
        />
      }
    </div>
  );
}

export default App;
