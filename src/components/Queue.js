import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon } from 'semantic-ui-react';

import QueueModal from './QueueModal';
import ConfirmationModal from './ConfirmationModal';

const SHOULD_DISPLAY = (queue) => queue ? DISPLAY_MODES.DISPLAY_QUEUE : DISPLAY_MODES.NO_QUEUE;
const DELETE_CONFIRMATION = (name) => `Are you sure you want to delete the Queue: ${name}?`;

const DISPLAY_MODES = Object.freeze({
  NO_QUEUE: 'noQueue',
  EDIT_QUEUE: 'editQueue',
  DISPLAY_QUEUE: 'Queue',
  NEED_CONFIRMATION: 'confirmQueue',
});

// The queue will be undefined if this is the 'add queue' button instance
function Queue({ queue, handleCreate, handleEdit, handleDelete }) {
  const [displayMode, setDisplayMode] = useState(SHOULD_DISPLAY(queue));

  const {id, name, color, pendingTasks} = queue || {};
  const taskCount = (pendingTasks || []).length;

  const onClickCreateOrEdit = () => {
    setDisplayMode(DISPLAY_MODES.EDIT_QUEUE);
  };

  const onClickView = () => {
    // TODO
  };

  const onClickDelete = () => {
    setDisplayMode(DISPLAY_MODES.NEED_CONFIRMATION);
  };

  const onClickCancel = () => {
    setDisplayMode(SHOULD_DISPLAY(queue));
  };

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
            <button onClick={onClickCreateOrEdit}>
              <Icon className='plus circle' />
            </button>
          ,[DISPLAY_MODES.EDIT_QUEUE]:
            <QueueModal
              queue={queue}
              onConfirm={onModalConfirm}
              onCancel={onClickCancel}
            />
          ,[DISPLAY_MODES.DISPLAY_QUEUE]:
            <>
              <Card style={{ marginBottom: '1.2em' }}>
                <div className='ui tiny label' style={{ backgroundColor: color }}/>
                <Card.Content>
                  <Card.Header textAlign='center' style={{ overflowWrap: 'break-word' }}>
                    {name}
                  </Card.Header>
                </Card.Content>
                <Card.Content extra>
                  <button className='left floated' onClick={onClickCreateOrEdit} style={{ marginRight: '0.65em' }}>
                    <i className='large edit icon' />
                  </button>
                  <button className='left floated' onClick={onClickView}>
                    <Icon className='large eye icon'/>
                  </button>
                  <div className='right floated'>
                    { taskCount > 0 &&
                      <button className='ui circular label' style={{ marginRight: '0.65em' }}>
                        {taskCount}
                      </button>
                    }
                    <button onClick={onClickDelete}>
                      <Icon className='large trash icon' />
                    </button>
                  </div>
                </Card.Content>
              </Card>
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
