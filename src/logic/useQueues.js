import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

function useQueues() {
  const DELETE_CONFIRMATION = (name) => `Are you sure you want to delete the Queue: ${name}?`;

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

  const actionDeleteQueue = (actionConfirmed) => {
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

  const actionCancelQueueModal = () => {
    selectedQueueRef.current = undefined;
    setShowQueueModal(false);
  };

  const actionAcceptQueueModal = (name) => {
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

  return {
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
  };
};

export default useQueues;
