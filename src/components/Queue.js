import React, { useState } from 'react';
import PropTypes from 'prop-types';

import QueueModal from './QueueModal';
import ConfirmationModal from './ConfirmationModal';

import deleteIcon from '../icons/trash.svg';
import editIcon from '../icons/edit.svg';
import '../styles/Queue.css';

const ICON_SIZE = '14px';

const DISPLAY_MODES = Object.freeze({
  NO_QUEUE: 'noQueue',
  EDIT_QUEUE: 'editQueue',
  DISPLAY_QUEUE: 'Queue',
  NEED_CONFIRMATION: 'confirmQueue',
});

const SHOULD_DISPLAY = (queue) => queue ? DISPLAY_MODES.DISPLAY_QUEUE : DISPLAY_MODES.NO_QUEUE;

const DELETE_CONFIRMATION = (name) => `Are you sure you want to delete the Queue: ${name}?`;

// The queue will be undefined if this is the 'add queue' button instance
function Queue({ queue, handleCreate, handleEdit, handleDelete }) {
  const [displayMode, setDisplayMode] = useState(SHOULD_DISPLAY(queue));

  const {id, name, color, pendingTasks} = queue || {};
  const taskCount = (pendingTasks || []).length;

  const onClickCreateOrEdit = () => {
    setDisplayMode(DISPLAY_MODES.EDIT_QUEUE);
  };

  const onClickDelete = () => {
    setDisplayMode(DISPLAY_MODES.NEED_CONFIRMATION);
  };

  const onClickCancel = () => {
    setDisplayMode(SHOULD_DISPLAY(queue));
  }

  const onModalConfirm = (changes) => {
    if(!changes.name || !changes.color) {
      return;
    }

    setDisplayMode(SHOULD_DISPLAY(queue));
    
    if(id) {
      changes.id = id;
      handleEdit(changes);
    } else {
      handleCreate(changes);
    }
  };

  return (
    <div className={displayMode}>
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
              <div className='queueName'>
                {name}
              </div>
              <div className='taskCount'>
                {taskCount > 0 ? taskCount : null}
              </div>
              <div className='queueButtons'>
                <button className='deleteButton' onClick={onClickDelete}>
                  <img src={deleteIcon} width={ICON_SIZE} height={ICON_SIZE} alt='deleteIcon' />
                </button>
                <button className='editButton' onClick={onClickCreateOrEdit}>
                  <img src={editIcon} width={ICON_SIZE} height={ICON_SIZE} alt='editIcon' />
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
