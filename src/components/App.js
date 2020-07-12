import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import QueueList from './QueueList';
import QueueModal from './QueueModal';

import '../styles/App.css';

function App() {
  const [queues, setQueues] = useState([]);
  const [showQueueModal, setShowQueueModal] = useState(false);

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
  };

  const onClickDeleteQueue = (e, id) => {
    //e.target.disabled = true; // TODO: need the disable?
    console.log(`delete e: ${e.target}, id: ${id}`);
  };

  const onClickEditQueue = (e, id) => {
    console.log(`edit e: ${e.target}, id: ${id}`);
  };

  const onClickAddQueue = () => setShowQueueModal(true);
  
  const onCancel = () => setShowQueueModal(false);
  const onAccept = (name) => {
    const color = '#4287f5'; // TODO: implement as parameter

    addQueue(name, color);

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
      { showQueueModal &&
        <QueueModal
          onAccept={onAccept}
          onClose={onCancel}
        />
      }
    </div>
  );
}

export default App;
