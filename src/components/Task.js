import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Input, Label } from 'semantic-ui-react';

const DISPLAY_MODES = Object.freeze({
  NO_TASK: 1,
  EDIT_TASK: 2,
  DISPLAY_TASK: 3,
  NEED_CONFIRMATION: 4,
});

const SHOULD_DISPLAY = (taskInfo) => taskInfo ? DISPLAY_MODES.DISPLAY_TASK : DISPLAY_MODES.NO_TASK;

const HTML_ID_INPUT_TASK = 'task';
const HTML_ID_INPUT_QUEUE = 'queue-select';
const LABEL_QUEUE_SELECT = 'Choose a Queue:';
const LABEL_INPUT_TASK = 'Enter task';
const DELETE_CONFIRMATION = (queueName) => {
  return `Are you sure you want to delete this task, in queue: ${queueName}?`;
}

// The taskInfo will be undefined if this is the 'add queue' button instance
function Task({ taskInfo, queueDropdownOptions, handleCreate, handleEdit, handleDelete, handleComplete }) {
  const [displayMode, setDisplayMode] = useState(SHOULD_DISPLAY(taskInfo));

  const { queueName, queueId: initialQueueId, id, index, color, text: initialText } = taskInfo || {};

  const [beforeEditValues, setBeforeEditValues] = useState({});
  const [text, setText] = useState(initialText || '');
  const [queueId, setQueueId] = useState(initialQueueId || queueDropdownOptions[0].id);

  const onClickCreateOrEdit = () => {
    setBeforeEditValues({
      text,
      queueId,
    });

    setDisplayMode(DISPLAY_MODES.EDIT_TASK);
  };

  const onClickDelete = () => {
    setDisplayMode(DISPLAY_MODES.NEED_CONFIRMATION);
  };

  const onClickCancel = () => {
    if(displayMode === DISPLAY_MODES.EDIT_TASK) {
      setText(beforeEditValues.text);
      setQueueId(beforeEditValues.queueId);

      setBeforeEditValues({});
    }

    setDisplayMode(SHOULD_DISPLAY(taskInfo));
  }

  const onChangeDropdown = (event) => {
    if(queueId !== event.target.value) {
      setQueueId(event.target.value);
    }
  }

  const onModalConfirm = () => {
    if(beforeEditValues.text !== text || beforeEditValues.queueId !== queueId) {
      if(id) {
        handleEdit(queueId, index, text);
      } else {
        // Need to manually reset text and queueId to prevent staleness after creation.
        setText('');
        setQueueId(queueDropdownOptions[0].id);

        handleCreate(queueId, text);
      }
    }

    setBeforeEditValues({});
    setDisplayMode(SHOULD_DISPLAY(taskInfo));
  };

  const onDeleteConfirm = () => {
    setDisplayMode(SHOULD_DISPLAY(taskInfo));

    handleDelete(queueId, index);
  };

  const onClickComplete = () => {
    setDisplayMode(SHOULD_DISPLAY(taskInfo));

    handleComplete(queueId, index);
  };

  const getCardContent = () => {
    return (
      <>
        <div className='colorStripe' style={{ backgroundColor: color }}/>
        {
          displayMode === DISPLAY_MODES.EDIT_TASK &&
          <>
            { 
              !initialQueueId &&
                <>
                  <Label htmlFor={HTML_ID_INPUT_QUEUE}>{LABEL_QUEUE_SELECT}</Label>
                  <select id={HTML_ID_INPUT_QUEUE} onChange={onChangeDropdown}>
                    {
                      queueDropdownOptions.map((queue) =>
                        <option key={queue.id} value={queue.id}>{queue.name}</option>
                      )
                    }
                  </select>
                </>
            }
            <Label htmlFor={HTML_ID_INPUT_TASK}>{LABEL_INPUT_TASK}</Label>
            <Input
              id={HTML_ID_INPUT_TASK}
              type='text'
              value={text}
              onChange={event => setText(event.target.value)}
            />
          </>
        }
        {
          displayMode !== DISPLAY_MODES.EDIT_TASK &&
          <Card.Content>
            <div style={{ overflowWrap: 'break-word' }}>
              {text}
            </div>
          </Card.Content>
        }
        {
          displayMode === DISPLAY_MODES.NEED_CONFIRMATION &&
            <Label>{DELETE_CONFIRMATION(queueName)}</Label>
        }
      </>
    );
  };

  const getCardExtraContent = () => {
    if(displayMode === DISPLAY_MODES.DISPLAY_TASK) {
      return (
        <Card.Content extra>
          <button onClick={onClickCreateOrEdit} style={{ marginRight: '0.65em' }}>
            <Icon className='pencil alternate' />
          </button>
          <div style={{ display: 'inline' }}>
          <button onClick={onClickDelete}>
              <Icon className='trash' />
          </button>
          <button className='right floated' onClick={onClickComplete}>
            <Icon className='check square outline' />
          </button>
          </div>
        </Card.Content>
      );
    }

    if(displayMode === DISPLAY_MODES.EDIT_TASK) {
      return getConfirmationButtons(onModalConfirm, onClickCancel);
    }

    if(displayMode === DISPLAY_MODES.NEED_CONFIRMATION) {
      return getConfirmationButtons(onDeleteConfirm, onClickCancel);
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
    <div className='Task'>
      {
        displayMode === DISPLAY_MODES.NO_TASK
        ?
          <button onClick={onClickCreateOrEdit}>
            <Icon className='plus circle' />
          </button>
        :
          <Card style={{ marginBottom: '1em' }}>
            {
              getCardContent()
            }
            {
              getCardExtraContent()
            }
          </Card>
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
