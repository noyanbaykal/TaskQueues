import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { findItem } from './utilities';
import { client } from '../Client';

const viewModes = Object.freeze({
  topTasks: 'topTasks',
  allPendingTasks: 'allPendingTasks',
  viewQueue: 'viewQueue',
})

const getItemById = (array, id) => {
  return findItem(array, 'id', id);
};

function useQueues() {
  const [queues, setQueues] = useState([]);
  const [view, setView] = useState(viewModes.topTasks);
  const [viewQueueId, setViewQueueId] = useState(undefined);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  useEffect(() => {
    client.getQueues().then((savedQueues) => {
      if(savedQueues.length > 0) {
        setViewQueueId(savedQueues[0].id);
      }

      setQueues(savedQueues);
    });
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

  const initializeTaskInfo = (queue, task) => {
    return {
      queueName: queue.name,
      queueId: queue.id,
      id: task.id,
      color: queue.color,
      text: task.text,
      completed: task.completed,
    }
  }

  const getTasksFromQueue = (queueId) => {
    const taskInfos = [];

    const queue = getItemById(queues, queueId);
    if(!queue) {
      return taskInfos;
    }

    if(queue.pendingTasks.length > 0) {
      taskInfos.push(
        ...queue.pendingTasks.map((task) => {
          return initializeTaskInfo(queue, task);
        })
      );
    }

    if(showCompletedTasks && queue.completedTasks.length > 0) {
      taskInfos.push(
        ...queue.completedTasks.map((task) => {
          return initializeTaskInfo(queue, task);
        })
      );
    }

    return taskInfos;
  }

  const getTopTasksHelper = (queue, sourceArray, destinationArray,  count) => {
    if(sourceArray.length > 0) {
      let endIndex = sourceArray.length;
      if(count && count < endIndex) {
        endIndex = count;
      }

      for(let i = 0; i < endIndex; i++) {
        destinationArray.push(initializeTaskInfo(queue, sourceArray[i]));
      }
    }
  }

  const getTopTasks = (count) => {
    const taskInfos = [];

    for(let i = 0; i < queues.length; i++) {
      const queue = queues[i];

      getTopTasksHelper(queue, queue.pendingTasks, taskInfos, count);
      
      if(showCompletedTasks) {
        getTopTasksHelper(queue, queue.completedTasks, taskInfos, count);
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

    const queue = getItemById(newQueues, queueId);
    if(queue) {
      const task = {
        id: uuidv4(),
        text,
      };
      
      queue.pendingTasks.push(task);

      updateQueues(newQueues);
    }
  };
  
  const actionEditTask = (queueId, taskId, newText) => {
    const newQueues = [...queues];

    const queue = getItemById(newQueues, queueId);
    if(queue) {
      const task = getItemById(queue.pendingTasks, taskId);
      task.text = newText;

      updateQueues(newQueues);
    }
  };
  
  const actionDeleteTask = (queueId, taskId) => {
    const newQueues = [...queues];

    const queue = getItemById(newQueues, queueId);
    if(queue) {
      queue.pendingTasks = queue.pendingTasks.filter(task => task.id !== taskId);

      updateQueues(newQueues);
    }
  };
  
  const actionCompleteTask = (queueId, taskId) => {
    const newQueues = [...queues];

    let taskIndex;
    const queue = getItemById(newQueues, queueId);
    if(queue) {
      for(let i = 0; i < queue.pendingTasks.length; i++) {
        if(queue.pendingTasks[i].id === taskId) {
          taskIndex = i;
          break;
        }
      }
      if(taskIndex !== undefined) {
        const [completedTask] = queue.pendingTasks.splice(taskIndex, 1);
        completedTask.completed = true;

        queue.completedTasks.unshift(completedTask);
        updateQueues(newQueues);
      }
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
