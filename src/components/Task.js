import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Input, Label, Transition } from 'semantic-ui-react';

import { DISPLAY_MODES, SHOULD_DISPLAY } from '../logic/utilities';

const TASK_ANIMATION_TYPE = 'jiggle';
const TASK_ANIMATION_DURATION = 500;
const TASK_BORDER_SIZE = '0.8em';
const COMPLETED_TASK_OPACITY = 0.65;

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

  const { queueName, queueId: initialQueueId, id, color, text: initialText, completed } = taskInfo || {};

  const [beforeEditValues, setBeforeEditValues] = useState({});
  const [text, setText] = useState(initialText || '');
  const [queueId, setQueueId] = useState(initialQueueId || queueDropdownOptions[0].id);
  const [showButtons, setShowButtons] = useState(false);
  const [taskCompletedTransition, setTaskCompletedTransition] = useState(true);

  const onClickCreateOrEdit = () => {
    setBeforeEditValues({
      text,
      queueId,
    });

    setDisplayMode(DISPLAY_MODES.EDIT);
  };

  const onClickDelete = () => {
    setDisplayMode(DISPLAY_MODES.NEED_CONFIRMATION);
  };

  const onClickCancel = () => {
    if(displayMode === DISPLAY_MODES.EDIT) {
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
        handleEdit(queueId, id, text);
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

    handleDelete(queueId, id);
  };

  const onClickComplete = () => {
    setTaskCompletedTransition((taskCompletedTransition) => !taskCompletedTransition);

    setTimeout(() => {
      setDisplayMode(SHOULD_DISPLAY(taskInfo));

      handleComplete(queueId, id);
    }, TASK_ANIMATION_DURATION);
  };

  const getCardContent = () => {
    return (
      <>
        {
          displayMode === DISPLAY_MODES.EDIT &&
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
          displayMode !== DISPLAY_MODES.EDIT &&
            <Card.Content>
              {/* Need to override text color after giving the card an onClick handler*/}
              <div style={{ overflowWrap: 'break-word', textAlign: 'center', color: 'black' }}>
                {text}
                {
                  completed &&
                    <Icon className='right floated green check'></Icon>
                }
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
    if(displayMode === DISPLAY_MODES.DISPLAY) {
      if(!showButtons) {
        return null;
      }
      
      return (
        <Card.Content extra>
          <button onClick={onClickCreateOrEdit} style={{ marginRight: '0.65em' }}>
            <Icon className='pencil alternate' />
          </button>
          <button onClick={onClickDelete}>
              <Icon className='trash' />
          </button>
          <button className='right floated' onClick={onClickComplete}>
            <Icon className='check square outline' />
          </button>
        </Card.Content>
      );
    }

    if(displayMode === DISPLAY_MODES.EDIT) {
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
        <button className='left floated' onClick={onConfirm} disabled={!text || text.length < 1 ? true : undefined}>
          <Icon className='check' />
        </button>
        <button className='right floated' onClick={onCancel}>
          <Icon className='delete' />
        </button>
      </Card.Content>
    );
  }

  // Semantic applies a hover effect to cards with onClick handlers set.
  // Completed cards should not have this effect, or show any buttons.
  const getCardOnClickValue = () => {
    if (completed) {
      return undefined;
    }

    return function() {
      setShowButtons((showButtons) => !showButtons);
    }
  }

  return (
    <div className={`Task ${displayMode}`} >
      {
        displayMode === DISPLAY_MODES.NO_CONTENT
        ?
          <div style={{ textAlign: 'center', paddingLeft: TASK_BORDER_SIZE }}>
            <button onClick={onClickCreateOrEdit} style={{ display: 'inline-block', margin: '0 auto' }}>
              <Icon className='plus circle' />
            </button>
          </div>
        :
          <Transition
            animation={TASK_ANIMATION_TYPE}
            duration={TASK_ANIMATION_DURATION}
            visible={taskCompletedTransition}
          >
            <Card
              style={{ marginBottom: '1em', borderLeft: `${TASK_BORDER_SIZE} solid ${color}`, opacity: completed ? COMPLETED_TASK_OPACITY : undefined }}
              onClick={getCardOnClickValue()}
            >
              {
                getCardContent()
              }
              {
                getCardExtraContent()
              }
            </Card>
          </Transition>
      }
    </div>
  )
};

Task.propTypes = {
  taskInfo: PropTypes.shape({
    queueName: PropTypes.string.isRequired,
    queueId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool,
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
