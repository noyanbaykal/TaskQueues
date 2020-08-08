import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { client } from '../Client';

const getQueue = (queues, queueId) => {
  for(let i = 0; i < queues.length; i++) {
    if(queues[i].id === queueId) {
      return queues[i];
    }
  }

  return undefined;
};

function useQueues() {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    client.getQueues().then(savedQueues => setQueues(savedQueues));
  }, []);

  const updateQueues = (newQueues) => {
    setQueues(newQueues);
    client.setQueues(newQueues);
  }

  const getTaskInfos = () => {
    const taskIndexToReturn = 0; // TODO: implement getting more than the top task?
    const taskInfos = [];

    for(let i = 0; i < queues.length; i++) {
      const queue = queues[i];

      if(queue.pendingTasks.length > 0) {
        const task = queue.pendingTasks[taskIndexToReturn];

        taskInfos.push({
          queueName: queue.name,
          queueId: queue.id,
          id: task.id,
          index: taskIndexToReturn,
          color: queue.color,
          text: task.text,
        });
      }
    }

    return taskInfos;
  };

  const getQueueDropdownOptions = () => {
    return queues.map(
      ({ name, id }) => ({ name, id })
    );
  };

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
    getTaskInfos,
    getQueueDropdownOptions,
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
