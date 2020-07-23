import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { client } from '../Client';

function useQueues() {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    client.getQueues().then(savedQueues => setQueues(savedQueues));
  }, []);

  const updateQueues = (newQueues) => {
    setQueues(newQueues);
    client.setQueues(newQueues);
  }

  const actionCreateQueue = (name) => {
    const color = '#4287f5'; // TODO: implement as parameter

    const newQueue = {
      name,
      color,
      id: uuidv4(),
      completedTasks: [],
      pendingTasks: [],
    };

    const newQueues = [...queues, newQueue];
    updateQueues(newQueues);
  };

  const actionEditQueue = (queueId, newName) => {
    // TODO: implement color editing

    const newQueues = [...queues];
    for(let i = 0; i < newQueues.length; i++) {
      if(newQueues[i].id === queueId) {
        newQueues[i].name = newName;
        break;
      }
    }

    updateQueues(newQueues);
  };

  const actionDeleteQueue = (queueId) => {
    const newQueues = queues.filter(queue => queue.id !== queueId);
    
    updateQueues(newQueues);
  };

  return {
    queues,
    actionCreateQueue,
    actionEditQueue,
    actionDeleteQueue,
  };
};

export default useQueues;
