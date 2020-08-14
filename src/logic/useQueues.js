import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { findItem } from './utilities';
import { client } from '../Client';

const viewModes = Object.freeze({
  allPendingTasks: 'allPendingTasks',
  topTasks: 'topTasks',
  viewQueue: 'viewQueue',
})

const getQueue = (queues, queueId) => {
  return findItem(queues, 'id', queueId);
};

function useQueues() {
  const [queues, setQueues] = useState([]);
  const [view, setView] = useState(viewModes.topTasks);
  const [viewQueueId, setViewQueueId] = useState(undefined);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  useEffect(() => {
    client.getQueues().then(savedQueues => setQueues(savedQueues));
  }, []);

  const getCurrentView = () => {
    return view;
  }

  const getShowCompletedTasks = () => {
    return showCompletedTasks;
  }

  const updateQueues = (newQueues) => {
    setQueues(newQueues);
    client.setQueues(newQueues);
  }

  const getTaskInfos = () => {
    switch(view) {
      case viewModes.viewQueue:
        return getTasksFromQueue(viewQueueId);
      case viewModes.allPendingTasks:
        return getTopTasks();
      case viewModes.topTasks:
      default:
        return getTopTasks(1);
    }
  };

  const initializeTaskInfo = (queue, task, index, completed) => {
    return {
      queueName: queue.name,
      queueId: queue.id,
      id: task.id,
      index: index,
      color: queue.color,
      text: task.text,
      completed
    }
  }

  const getTasksFromQueue = (queueId) => {
    const taskInfos = [];

    const queue = getQueue(queues, queueId);
    if(!queue) {
      return taskInfos;
    }

    if(queue.pendingTasks.length > 0) {
      taskInfos.push(
        ...queue.pendingTasks.map((task, index) => {
          return initializeTaskInfo(queue, task, index);
        })
      );
    }

    if(showCompletedTasks && queue.completedTasks.length > 0) {
      taskInfos.push(
        ...queue.completedTasks.map((task, index) => {
          return initializeTaskInfo(queue, task, index, true);
        })
      );
    }

    return taskInfos;
  }

  const getTopTasks = (count) => {
    const taskInfos = [];

    for(let i = 0; i < queues.length; i++) {
      const queue = queues[i];

      if(queue.pendingTasks.length > 0) {
        let endIndex = queue.pendingTasks.length;
        if(count && count < endIndex) {
          endIndex = count;
        }

        for(let j = 0; j < endIndex; j++) {
          taskInfos.push(initializeTaskInfo(queue, queue.pendingTasks[j], j));
        }
      }
    }

    return taskInfos;
  }

  const getQueueDropdownOptions = () => {
    return queues.map(
      ({ name, id }) => ({ name, id })
    );
  };

  const getSelectedQueueId = () => {
    return viewQueueId;
  }

  const actionViewChange = (newView) => {
    if(view !== newView) {
      setView(newView);
    }
  }

  const actionCreateQueue = ({ name, color }) => {
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

  const actionEditQueue = ({ id, name, color }) => {
    const newQueues = [...queues];
    for(let i = 0; i < newQueues.length; i++) {
      if(newQueues[i].id === id) {
        newQueues[i].name = name;
        newQueues[i].color = color;
        break;
      }
    }

    updateQueues(newQueues);
  };

  const actionDeleteQueue = (queueId) => {
    const newQueues = queues.filter(queue => queue.id !== queueId);
    
    updateQueues(newQueues);
  };

  const actionViewQueue = (queueId) => {
    if(queueId) {
      setViewQueueId(queueId);
      setView(viewModes.viewQueue);
    } 
  }

  const actionToggleShowCompletedTasks = () => {
    setShowCompletedTasks((showCompletedTasks) => !showCompletedTasks);
  }

  const actionCreateTask = (queueId, text) => {
    const newQueues = [...queues];

    const queue = getQueue(newQueues, queueId);
    if(queue) {
      const task = {
        id: uuidv4(),
        text,
      };
      
      queue.pendingTasks.push(task);

      updateQueues(newQueues);
    }
  };
  
  const actionEditTask = (queueId, taskIndex, newText) => {
    const newQueues = [...queues];

    const queue = getQueue(newQueues, queueId);
    if(queue) {
      queue.pendingTasks[taskIndex].text = newText;

      updateQueues(newQueues);
    }
  };

  const resetView = () => {
    setView(viewModes.topTasks);
    setViewQueueId(undefined);
  };
  
  const actionDeleteTask = (queueId, taskIndex) => {
    const newQueues = [...queues];

    const queue = getQueue(newQueues, queueId);
    if(queue) {
      queue.pendingTasks.splice(taskIndex, 1);

      updateQueues(newQueues);
    }
  };
  
  const actionCompleteTask = (queueId, taskIndex) => {
    const newQueues = [...queues];

    const queue = getQueue(newQueues, queueId);
    if(queue) {
      const completedTask = queue.pendingTasks.splice(taskIndex, 1);
      queue.completedTasks.push(completedTask[0]);

      updateQueues(newQueues);
    }
  };

  return {
    queues,
    viewModes,
    getCurrentView,
    getShowCompletedTasks,
    getTaskInfos,
    getQueueDropdownOptions,
    getSelectedQueueId,
    actionViewChange,
    actionViewQueue,
    actionToggleShowCompletedTasks,
    actionCreateQueue,
    actionEditQueue,
    actionDeleteQueue,
    actionCreateTask,
    actionEditTask,
    actionDeleteTask,
    actionCompleteTask,
  };
};

export default useQueues;
