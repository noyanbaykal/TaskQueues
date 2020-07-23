import React, { useState } from 'react';
import PropTypes from 'prop-types';

import QueueModal from './QueueModal';
import ConfirmationModal from './ConfirmationModal';

import '../styles/Queue.css';
import '../styles/gg-trash.css';
import '../styles/gg-pen.css';

const DISPLAY_MODES = Object.freeze({
  NO_QUEUE: 1,
  EDIT_QUEUE: 2,
  DISPLAY_QUEUE: 3,
  NEED_CONFIRMATION: 4,
});

const SHOULD_DISPLAY = (queue) => queue ? DISPLAY_MODES.DISPLAY_QUEUE : DISPLAY_MODES.NO_QUEUE;

const DELETE_CONFIRMATION = (name) => `Are you sure you want to delete the Queue: ${name}?`;

// The queue will be undefined if this is the 'add queue' button instance
function Queue({ queue, handleCreate, handleEdit, handleDelete }) {
  const [displayMode, setDisplayMode] = useState(SHOULD_DISPLAY(queue));

  const onClickCreateOrEdit = () => {
    setDisplayMode(DISPLAY_MODES.EDIT_QUEUE);
  };

  const onClickDelete = () => {
    setDisplayMode(DISPLAY_MODES.NEED_CONFIRMATION);
  };

  const onClickCancel = () => {
    setDisplayMode(SHOULD_DISPLAY(queue));
  }

  const onModalConfirm = (name, queueId) => {
    if(queueId) {
      handleEdit(queueId, name);
    } else {
      handleCreate(name);
    }

    setDisplayMode(SHOULD_DISPLAY(queue));
  };

  const {id, name, color, pendingTasks} = queue || {};
  const taskCount = (pendingTasks || []).length;

  return (
    <div className='Queue'>
      {
        {
          [DISPLAY_MODES.NO_QUEUE]:
            <button className='createQueue' onClick={onClickCreateOrEdit}>&#43;</button>
          ,[DISPLAY_MODES.EDIT_QUEUE]:
            <QueueModal
              queue={queue}
              onConfirm={onModalConfirm}
              onCancel={onClickCancel}
            />
          ,[DISPLAY_MODES.DISPLAY_QUEUE]:
            <>
              <div className='colorStripe' style={{ backgroundColor: color }}/>
              <div className='name'>
                {name}
              </div>
              <div className='taskCount'>
                {taskCount > 0 ? taskCount : null}
              </div>
              <div className='buttons'>
                <button className='deleteButton' onClick={onClickDelete}>
                  <i className="gg-trash"></i>
                </button>
                <button className='editButton' onClick={onClickCreateOrEdit}>
                  <i className="gg-pen"></i>
                </button>
              </div>
            </>
          ,[DISPLAY_MODES.NEED_CONFIRMATION]:
            <ConfirmationModal
              prompt={DELETE_CONFIRMATION(name)}
              onConfirm={() => handleDelete(id)}
              onCancel={onClickCancel}
            />
        }[displayMode]
      }
    </div>
  );
}

Queue.propTypes = {
  queue: PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    pendingTasks: PropTypes.array.isRequired,
  }),
  handleCreate: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Queue;
