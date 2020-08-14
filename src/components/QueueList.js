import React from 'react';

import { Icon } from 'semantic-ui-react';

import Queue from './Queue.js';
import TaskList from './TaskList';

import useQueues from '../logic/useQueues.js';

const SHOW_ALL_TASKS_ID = 'showAllTasks'
const SHOW_ALL_TASKS_LABEL = 'Show completed tasks'
const NO_QUEUES = 'Create a queue before adding tasks!';
const SMALL_OFFSET = '1em';

function QueueList() {
  const {
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
  } = useQueues();

  /* Needed getNamedItem to read custom attribute */
  const getCustomAttributeValue = (e) => {
    actionViewChange(e.target.attributes.getNamedItem('value').value);
  }

  const queueIdSelected = getSelectedQueueId() !== undefined;
  const view = getCurrentView();

  return (
    <div className='QueueList'>
      <div className='queueBar'>
        {
          queues.map((queue) => (
            <Queue
              key={queue.id}
              queue={queue}
              handleCreate={actionCreateQueue}
              handleEdit={actionEditQueue}
              handleDelete={actionDeleteQueue}
              handleView={actionViewQueue}
              active={getSelectedQueueId() === queue.id ? true : undefined}
            />
          ))
        }
        { 
          queues.length < 1 &&
            <div style={{ marginBottom: SMALL_OFFSET }}>
              {NO_QUEUES}
            </div>
        }
        <Queue
          handleCreate={actionCreateQueue}
          handleEdit={actionEditQueue}
          handleDelete={actionDeleteQueue}
          handleView={actionViewQueue}
        />
      </div>
      <div className='mainPanel'>
        <div className='controls' style={{ marginBottom: SMALL_OFFSET }}>
          <div style={{ display: 'inline', marginRight: '0.5em' }}>
            <Icon
              className={`circular close`}
              style={{ border: `1px solid blue` }}
              onClick={getCustomAttributeValue}
              value={viewModes.allPendingTasks}
            />
            <Icon
              className={`circular step forward`}
              style={{ border: `1px solid red`, marginLeft: '1em', marginRight: '1em' }}
              onClick={getCustomAttributeValue}
              value={viewModes.topTasks}
            />
            <div style={{ display: 'inline' }}>
              <Icon
                className={`circular plus`}
                style={{ border: `1px solid yellow` }}
                onClick={getCustomAttributeValue}
                value={viewModes.viewQueue}
                disabled={!queueIdSelected}
              />
              {
                viewModes.viewQueue === view &&
                  <>
                    <input
                      id={SHOW_ALL_TASKS_ID}
                      type='checkbox'
                      onChange={actionToggleShowCompletedTasks}
                      style={{ marginLeft: '0.5em', marginRight: '0.3em' }}
                      checked={getShowCompletedTasks()}
                    />
                    <label htmlFor={SHOW_ALL_TASKS_ID}>{SHOW_ALL_TASKS_LABEL}</label>
                  </>
              }
              </div>
          </div>
        </div>
        {
          queues.length > 0 &&
            <TaskList
              taskInfos={getTaskInfos()}
              queueDropdownOptions={getQueueDropdownOptions()}
              actionCreateTask={actionCreateTask}
              actionEditTask={actionEditTask}
              actionDeleteTask={actionDeleteTask}
              actionCompleteTask={actionCompleteTask}
            />
        }
      </div>
    </div>
  );
};

export default QueueList;
