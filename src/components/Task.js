import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

import ConfirmationModal from './ConfirmationModal';
import TaskModal from './TaskModal.js';

import '../styles/Task.css';

const DISPLAY_MODES = Object.freeze({
  NO_TASK: 1,
  EDIT_TASK: 2,
  DISPLAY_TASK: 3,
  NEED_CONFIRMATION: 4,
});

const SHOULD_DISPLAY = (taskInfo) => taskInfo ? DISPLAY_MODES.DISPLAY_TASK : DISPLAY_MODES.NO_TASK;

const DELETE_CONFIRMATION = (text, queueName) => {
  return `Are you sure you want to delete the task: ${text}, in queue: ${queueName}`;
}

// The taskInfo will be undefined if this is the 'add queue' button instance
function Task({ taskInfo, queueDropdownOptions, handleCreate, handleEdit, handleDelete, handleComplete }) {
  const [displayMode, setDisplayMode] = useState(SHOULD_DISPLAY(taskInfo));

  const { queueName, queueId, id, index, color, text } = taskInfo || {};

  const onClickCreateOrEdit = () => {
    setDisplayMode(DISPLAY_MODES.EDIT_TASK);
  };

  const onClickDelete = () => {
    setDisplayMode(DISPLAY_MODES.NEED_CONFIRMATION);
  };

  const onClickCancel = () => {
    setDisplayMode(SHOULD_DISPLAY(taskInfo));
  }

  const onModalConfirm = (dropdownQueueId, newtext) => {
    setDisplayMode(SHOULD_DISPLAY(taskInfo));

    if(id) {
      if(text !== newtext) {
        handleEdit(dropdownQueueId, index, newtext);
      }
    } else {
      handleCreate(dropdownQueueId, newtext);
    }
  };

  const onDeleteConfirm = () => {
    setDisplayMode(SHOULD_DISPLAY(taskInfo));

    handleDelete(queueId, index);
  };

  const onClickComplete = () => {
    setDisplayMode(SHOULD_DISPLAY(taskInfo));

    handleComplete(queueId, index);
  };

  return (
    <div className='Task'>
      {
        {
          [DISPLAY_MODES.NO_TASK]:
            <Button icon onClick={onClickCreateOrEdit}>
              <Icon name='plus circle' />
            </Button>
          ,[DISPLAY_MODES.EDIT_TASK]:
            <TaskModal
              taskInfo={taskInfo}
              queueDropdownOptions={queueDropdownOptions}
              onConfirm={onModalConfirm}
              onCancel={onClickCancel}
            />
          ,[DISPLAY_MODES.DISPLAY_TASK]:
          <>
            <div className='colorStripe' style={{ backgroundColor: color }}/>
            <div className='taskText'>
              {text}
            </div>
            <div className='taskButtons'>
              <Button icon onClick={onClickDelete}>
                  <Icon name='trash' />
              </Button>
              <Button icon onClick={onClickCreateOrEdit}>
                <Icon name='pencil alternate' />
              </Button>
              <Button icon onClick={onClickComplete}>
                <Icon name='check square outline' />
              </Button>
            </div>
          </>
          ,[DISPLAY_MODES.NEED_CONFIRMATION]:
            <ConfirmationModal
              prompt={DELETE_CONFIRMATION(text, queueName)}
              onConfirm={onDeleteConfirm}
              onCancel={onClickCancel}
            />
        }[displayMode]
      }
    </div>
  )
};

Task.propTypes = {
  taskInfo: PropTypes.shape({
    queueName: PropTypes.string.isRequired,
    queueId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
  queueDropdownOptions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  })).isRequired,
  handleCreate: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleComplete: PropTypes.func.isRequired,
};

export default Task;
