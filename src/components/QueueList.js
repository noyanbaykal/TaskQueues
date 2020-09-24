import React from 'react';
import { Grid } from 'semantic-ui-react';

import Queue, { QUEUE_COMPONENT_NAME } from './Queue.js';
import { TASK_NAME } from './Task.js';
import TaskList from './TaskList';

import useQueues from '../logic/useQueues.js';
import { getLabelRadioTop, getLabelRadioAll, getLabelRadioView, getLabelShowCompleted, getLabelCantCreate } from '../locales/english';

const SMALL_OFFSET = '1em';
const VIEW_RADIO = 'viewRadio'
const VIEW_RADIO_ID_TOP = 'viewRadioTop';
const VIEW_RADIO_LABEL_TOP = getLabelRadioTop(TASK_NAME);
const VIEW_RADIO_ID_ALL = 'viewRadioAll';
const VIEW_RADIO_LABEL_ALL = getLabelRadioAll(TASK_NAME);
const VIEW_RADIO_ID_QUEUE = 'viewRadioQueue';
const VIEW_RADIO_LABEL_QUEUE = getLabelRadioView(QUEUE_COMPONENT_NAME);
const SHOW_ALL_TASKS_ID = 'showAllTasks'
const SHOW_ALL_TASKS_LABEL = getLabelShowCompleted(TASK_NAME);
const NO_QUEUES = getLabelCantCreate(QUEUE_COMPONENT_NAME, TASK_NAME);


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

  const getViewRadioInput = (id, label, viewMode, disabled) => {
    return (
      <div>
        <input type="radio" name={VIEW_RADIO}
          id={id}
          value={viewMode}
          style={{ marginRight: '0.3em' }}
          onChange={(e) => actionViewChange(e.target.value)}
          checked={view === viewMode}
          disabled={disabled}
        />
        <label htmlFor={id} style={{ marginRight: '1em' }}>
          {label}
        </label>
      </div>
    );
  };

  const selectedQueueId = getSelectedQueueId();
  const view = getCurrentView();

  return (
    <Grid className='QueueList' columns={2} divided>
      <Grid.Row>
        <Grid.Column>
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
                  active={selectedQueueId === queue.id ? true : undefined}
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
        </Grid.Column>
        <Grid.Column>
          <div className='mainPanel'>
            {
              queues.length > 0 &&
                <div className='controls' style={{ marginBottom: SMALL_OFFSET, display: 'flex' }}>
                  <div style={{ marginRight: '0.5em' }}>
                    { getViewRadioInput(VIEW_RADIO_ID_TOP, VIEW_RADIO_LABEL_TOP, viewModes.topTasks) }
                    { getViewRadioInput(VIEW_RADIO_ID_ALL, VIEW_RADIO_LABEL_ALL, viewModes.allPendingTasks) }
                    { getViewRadioInput(VIEW_RADIO_ID_QUEUE, VIEW_RADIO_LABEL_QUEUE, viewModes.viewQueue, selectedQueueId === undefined) }
                  </div>
                  <div >
                    <input
                        id={SHOW_ALL_TASKS_ID}
                        type='checkbox'
                        onChange={actionToggleShowCompletedTasks}
                        style={{ marginLeft: '0.5em', marginRight: '0.3em' }}
                        checked={getShowCompletedTasks()}
                      />
                    <label htmlFor={SHOW_ALL_TASKS_ID}>{SHOW_ALL_TASKS_LABEL}</label>
                  </div>
                </div>
            }
            {
              queues.length > 0 &&
                <TaskList
                  taskInfos={getTaskInfos()}
                  parentObjectName={QUEUE_COMPONENT_NAME}
                  queueDropdownOptions={getQueueDropdownOptions()}
                  actionCreateTask={actionCreateTask}
                  actionEditTask={actionEditTask}
                  actionDeleteTask={actionDeleteTask}
                  actionCompleteTask={actionCompleteTask}
                />
            }
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default QueueList;
