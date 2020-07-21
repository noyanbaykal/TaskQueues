import { useState, useRef } from 'react';

import { client } from '../Client';

function useTasks(queues) {
  const DELETE_CONFIRMATION = (taskText, queueName) => {
    return `Are you sure you want to delete the task: ${taskText}, in queue: ${queueName}`;
  }

  const [selectedTaskInfo, setSelectedTaskInfo] = useState(undefined);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const getTopTasks = () => {
    const topTasks = [];

    for(let i = 0; i < queues.length; i++) {
      const queue = queues[i];

      if(queue.pendingTasks.length > 0) {
        topTasks.push({
          text: queue.pendingTasks[0], // TODO: show multiple tasks per queue?
          queueId: queue.id,
          index: 0,
          color: queue.color,
        })
      }
    }

    return topTasks;
  };

  // TODO: implement finishing a task!

  const onClickDeleteTask = (event, queueId, index, text) => {
    const idMatch = queues.filter(queue => queue.id === queueId);
    if(idMatch.length > 0) {
      const queue = idMatch[0];

      setSelectedTaskInfo({ queue, index, text });
      setShowConfirmationModal(true);
    }
  };

  const actionDeleteTask = (actionConfirmed) => {
    if(actionConfirmed) {
      const { queue, index } = selectedTaskInfo;

      queue.pendingTasks.splice(index, 1);

      client.setQueues(queues);
    }

    setShowConfirmationModal(false);
    setSelectedTaskInfo(undefined);
  };

  const onClickEditTask = (event, queueId, index, text) => {
    const idMatch = queues.filter(queue => queue.id === queueId);
    if(idMatch.length > 0) {
      const queue = idMatch[0];
      
      setSelectedTaskInfo({ queue, index, text });
      setShowTaskModal(true);
    }
  };

  const onClickAddTask = () => setShowTaskModal(true);

  const addTask = (queueId, text) => {
    const idMatch = queues.filter(queue => queue.id === queueId);
    if(idMatch.length > 0) {
      const queue = idMatch[0];

      queue.pendingTasks.push(text);
    }
  };

  const editTask = (text) => {
    const { queue, index } = selectedTaskInfo;

    queue.pendingTasks[index] = text;
  };

  const actionTaskModal = (taskInfo) => {
    if(taskInfo !== undefined) { // Not cancelled
      const { selectedQueueId, taskText } = taskInfo;

      if(selectedTaskInfo && selectedTaskInfo.text) { // Edited
        editTask(taskText);
      } else { // Created
        addTask(selectedQueueId, taskText);
      }

      client.setQueues(queues);
    }

    setSelectedTaskInfo(undefined);
    setShowTaskModal(false);
  };

  return {
    DELETE_CONFIRMATION,
    showTaskModal,
    showConfirmationModal,
    selectedTaskInfo,
    onClickAddTask,
    onClickEditTask,
    onClickDeleteTask,
    actionTaskModal,
    actionDeleteTask,
    getTopTasks,
  };
};

export default useTasks;
