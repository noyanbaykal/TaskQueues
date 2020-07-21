import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { client } from '../Client';

function useQueues() {
  const DELETE_CONFIRMATION = (name) => `Are you sure you want to delete the Queue: ${name}?`;

  const selectedQueueRef = useRef();
  
  const [queues, setQueues] = useState([]);
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    client.getQueues().then(savedQueues => setQueues(savedQueues));
  }, []);

  const onClickDeleteQueue = (event, id) => {
    const idMatch = queues.filter(queue => queue.id === id);
    if(idMatch.length > 0) {
      const queueToDelete = idMatch[0];
      selectedQueueRef.current = queueToDelete;

      setShowConfirmationModal(true);
    }
  };

  const actionDeleteQueue = (actionConfirmed) => {
    if(actionConfirmed) {
      const newQueues = queues.filter(queue => queue.id !== selectedQueueRef.current.id);
      
      setQueues(newQueues);
      client.setQueues(newQueues);
    }

    selectedQueueRef.current = undefined;
    setShowConfirmationModal(false);
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
    client.setQueues(newQueues);
  };

  const actionQueueModal = (name) => {
    if(name !== undefined) { // Not cancelled
      if (selectedQueueRef.current) { // Edited
        selectedQueueRef.current.name = name;
        // TODO:implement updating color

        client.setQueues(queues);
      } else { // Created
        const color = '#4287f5'; // TODO: implement as parameter
        addQueue(name, color);
      }
    }

    selectedQueueRef.current = undefined;
    setShowQueueModal(false);
  };

  return {
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
  };
};

export default useQueues;
