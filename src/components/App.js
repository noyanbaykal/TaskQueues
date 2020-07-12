import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import QueueList from './QueueList';
import QueueEdit from './QueueEdit';

import '../styles/App.css';

function App() {
  const [queues, setQueues] = useState([]);
  const [showQueueEdit, setShowQueueEdit] = useState(false);

  const addQueue = (name, color) => {
    const newQueues = queues.slice(0);

    const newQueue = {
      name,
      color,
      priority: queues.length,
      id: uuidv4(),
      completedTasks: [],
      pendingTasks: [],
    };

    newQueues.push(newQueue);
    setQueues(newQueues);
  };

  const onAddQueue = () => setShowQueueEdit(true);
  const onCancel = () => setShowQueueEdit(false);

  const onAccept = (name) => {
    const color = '#4287f5'; // TODO: implement as parameter

    addQueue(name, color);

    setShowQueueEdit(false);
  };

  return (
    <div className="App">
      <QueueList
        queues={queues}
        onAddQueue={onAddQueue}
        addButtonDisabled={showQueueEdit}
      />
      { showQueueEdit &&
        <QueueEdit
          onAccept={onAccept}
          onClose={onCancel}
        />
      }
    </div>
  );
}

export default App;
