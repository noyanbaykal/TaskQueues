import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Input, Label } from 'semantic-ui-react';

import CrudCard from './CrudCard';
import { getLabelSelectParent, getLabelInputType, getLabelDeleteConfirmationWithParentType } from '../locales/english';

export const TASK_NAME = 'Task';
export const NEW_TASK_ARIA_LABEL = `New ${TASK_NAME}`;
const COMPLETE_TASK_ICON = 'check square outline';
const TASK_ANIMATION_TYPE = 'jiggle';
const TASK_ANIMATION_DURATION = 500;
const TASK_BORDER_SIZE = '0.8em';
const COMPLETED_TASK_OPACITY = 0.65;
const CARD_STYLE = (color, completed) => {
  return {
    marginBottom: '1em',
    borderLeft: `${TASK_BORDER_SIZE} solid ${color}`,
    opacity: completed ? COMPLETED_TASK_OPACITY : undefined,
  };
};

const HTML_ID_INPUT_TASK = 'task';
const HTML_ID_INPUT_QUEUE = 'queue-select';
const LABEL_COMPLETE = 'Complete';

// The taskInfo will be undefined if this is the 'add queue' button instance
function Task({ taskInfo, index, queueDropdownOptions, handleCreate, handleEdit, handleDelete, handleComplete, parentObjectName }) {
  const { queueName, queueId: initialQueueId, id, color, text: initialText, completed } = taskInfo || {};

  const LABEL_SELECT_PARENT = getLabelSelectParent(parentObjectName);
  const LABEL_INPUT_TASK = getLabelInputType(TASK_NAME);
  const DELETE_CONFIRMATION = getLabelDeleteConfirmationWithParentType(TASK_NAME, parentObjectName, queueName, index)

  const [beforeEditValues, setBeforeEditValues] = useState({});
  const [text, setText] = useState(initialText || '');
  const [queueId, setQueueId] = useState(initialQueueId || queueDropdownOptions[0].id);
  const [taskCompletedTransition, setTaskCompletedTransition] = useState(true);

  const cardTransition = {
    type: TASK_ANIMATION_TYPE,
    duration: TASK_ANIMATION_DURATION,
    visible: taskCompletedTransition,
  };

  const storeBeforeInput = () => {
    setBeforeEditValues({
      text,
      queueId,
    });
  };

  const resetAfterInput = () => {
    setText(beforeEditValues.text);
    setQueueId(beforeEditValues.queueId);

    setBeforeEditValues({});
  };

  const onChangeDropdown = (event) => {
    if(queueId !== event.target.value) {
      setQueueId(event.target.value);
    }
  };

  const hasValidText = () => {
    return !text || text.length < 1;
  }

  const onModalConfirm = () => {
    if(beforeEditValues.text !== text || beforeEditValues.queueId !== queueId) {
      if(id) {
        handleEdit(queueId, id, text);
      } else {
        handleCreate(queueId, text);

        // Need to manually update values to prevent staleness after creation.
        setText('');
        setQueueId(queueDropdownOptions[0].id);
      }

      setBeforeEditValues({});
    }
  };

  const onDeleteConfirm = () => {
    handleDelete(queueId, id);
  };

  const onClickComplete = () => {
    setTaskCompletedTransition((taskCompletedTransition) => !taskCompletedTransition);
  };

  const afterClickComplete = () => {
    handleComplete(queueId, id);
  };

  const getEditContent = () => {
    return (
      <>
        { 
          !initialQueueId &&
            <>
              <Label htmlFor={HTML_ID_INPUT_QUEUE}>{LABEL_SELECT_PARENT}</Label>
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
    );
  }

  const getDisplayContent = () => {
    return (
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
    );
  };

  return (
    <CrudCard
      content={taskInfo}
      componentName={TASK_NAME}
      ariaLabelIdentifier={index ? `${TASK_NAME} ${index}` : NEW_TASK_ARIA_LABEL}
      cardTransition={cardTransition}
      getEditContent={getEditContent}
      getDisplayContent={getDisplayContent}
      deleteLabel={DELETE_CONFIRMATION}
      cardStyle={CARD_STYLE(color, completed)}
      specialButtonIcon={COMPLETE_TASK_ICON}
      specialButtonFunction={onClickComplete}
      specialButtonAfterFunction={afterClickComplete}
      specialButtonLabel={LABEL_COMPLETE}
      confirmDisabled={hasValidText() ? true : undefined}
      storeBeforeInput={storeBeforeInput}
      resetAfterInput={resetAfterInput}
      deleteHandler={onDeleteConfirm}
      modalHandler={onModalConfirm}
      enableClick={!completed}
      enableKeyboardClick={true}
    >
    </CrudCard>
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
  index: PropTypes.number,
  queueDropdownOptions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  })).isRequired,
  handleCreate: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleComplete: PropTypes.func.isRequired,
  parentObjectName: PropTypes.string.isRequired,
};

export default Task;
