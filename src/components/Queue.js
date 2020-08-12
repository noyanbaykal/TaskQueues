import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Input, Label } from 'semantic-ui-react';

const HTML_ID_INPUT_NAME = 'name';
const HTML_ID_INPUT_COLOR = 'color';
const INPUT_FIELD_INFO_NAME = 'Enter queue name:';
const INPUT_FIELD_INFO_COLOR = 'Select a color in hex format: #ffffff';
const DELETE_CONFIRMATION = 'Are you sure you want to delete this Queue?';

const DISPLAY_MODES = Object.freeze({
  NO_QUEUE: 'noQueue',
  EDIT_QUEUE: 'editQueue',
  DISPLAY_QUEUE: 'Queue',
  NEED_CONFIRMATION: 'confirmQueue',
});

const SHOULD_DISPLAY = (queue) => queue ? DISPLAY_MODES.DISPLAY_QUEUE : DISPLAY_MODES.NO_QUEUE;

const getRandomColor = () => {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`;
};

// The queue will be undefined if this is the 'add queue' button instance
function Queue({ queue, handleCreate, handleEdit, handleDelete }) {
  const {id, pendingTasks, name: queueName, color: queueColor} = queue || {};
  const taskCount = (pendingTasks || []).length;

  const [displayMode, setDisplayMode] = useState(SHOULD_DISPLAY(queue));
  const [beforeEditValues, setBeforeEditValues] = useState({});
  const [name, setName] = useState(queueName || '');
  const [color, setColor] = useState(queueColor || getRandomColor());

  const onClickCreateOrEdit = () => {
    setBeforeEditValues({
      name,
      color
    });

    setDisplayMode(DISPLAY_MODES.EDIT_QUEUE);
  };

  const onClickView = () => {
    // TODO
  };

  const onClickDelete = () => {
    setDisplayMode(DISPLAY_MODES.NEED_CONFIRMATION);
  };

  const onClickCancel = () => {
    if(displayMode === DISPLAY_MODES.EDIT_QUEUE) {
      setName(beforeEditValues.name);
      setColor(beforeEditValues.color);

      setBeforeEditValues({});
    }

    setDisplayMode(SHOULD_DISPLAY(queue));
  };

  const onModalConfirm = () => {
    if(beforeEditValues.name !== name || beforeEditValues.color !== color) {
      const changes = {
        name,
        color
      };

      if(id) {
        changes.id = id;
        handleEdit(changes);
      } else {
        handleCreate(changes);
      }

      // Need to reset these values manually before the create button is pushed again.
      setName(queueName || '');
      setColor(queueColor || getRandomColor());
    }

    setBeforeEditValues({});
    setDisplayMode(SHOULD_DISPLAY(queue));
  };

  const getCardContent = () => {
    return (
      <>
        <div className='ui tiny label' style={{ backgroundColor: color }}/>
        {
          displayMode === DISPLAY_MODES.EDIT_QUEUE &&
          <>
            <Label htmlFor={HTML_ID_INPUT_COLOR}>{INPUT_FIELD_INFO_COLOR}</Label>
            <Input
              id={HTML_ID_INPUT_COLOR}
              type='text'
              title='Enter Hex formatted color string'
              value={color}
              onChange={event => setColor(event.target.value)}
            />
            <Label htmlFor={HTML_ID_INPUT_NAME}>{INPUT_FIELD_INFO_NAME}</Label>
            <Input
              id={HTML_ID_INPUT_NAME}
              type='text'
              value={name}
              onChange={event => setName(event.target.value)}
            />
          </>
        }
        {
          displayMode !== DISPLAY_MODES.EDIT_QUEUE &&
          <Card.Content>
            <Card.Header textAlign='center' style={{ overflowWrap: 'break-word' }}>
              {name}
            </Card.Header>
          </Card.Content>
        }
        {
          displayMode === DISPLAY_MODES.NEED_CONFIRMATION &&
            <Label>{DELETE_CONFIRMATION}</Label>
        }
      </>
    );
  };

  const getCardExtraContent = () => {
    if(displayMode === DISPLAY_MODES.DISPLAY_QUEUE) {
      return (
        <Card.Content extra>
          <button className='left floated' onClick={onClickCreateOrEdit} style={{ marginRight: '0.65em' }}>
            <i className='large edit icon' />
          </button>
          <button className='left floated' onClick={onClickView}>
            <Icon className='large eye icon'/>
          </button>
          <div className='right floated'>
            { taskCount > 0 &&
              <div className='ui circular label' style={{ marginRight: '0.65em' }}>
                {taskCount}
              </div>
            }
            <button onClick={onClickDelete}>
              <Icon className='large trash icon' />
            </button>
          </div>
        </Card.Content>
      );
    }

    if(displayMode === DISPLAY_MODES.EDIT_QUEUE) {
      return getConfirmationButtons(onModalConfirm, onClickCancel);
    }

    if(displayMode === DISPLAY_MODES.NEED_CONFIRMATION) {
      return getConfirmationButtons(() => handleDelete(id), onClickCancel);
    }

    return null;
  };

  const getConfirmationButtons = (onConfirm, onCancel) => {
    return (
      <Card.Content extra>
        <button className='left floated' onClick={onConfirm}>
          <Icon className='check' />
        </button>
        <button className='right floated' onClick={onCancel}>
          <Icon className='delete' />
        </button>
      </Card.Content>
    );
  }

  return (
    <div className={displayMode}>
      {
        displayMode === DISPLAY_MODES.NO_QUEUE
        ?
          <button onClick={onClickCreateOrEdit}>
            <Icon className='plus circle' />
          </button>
        :
          <Card style={{ marginBottom: '1.2em' }}>
            {
              getCardContent()
            }
            {
              getCardExtraContent()
            }
          </Card>
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
