import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Input, Label, Transition } from 'semantic-ui-react';

import CrudCard from './CrudCard';
import { isHexColorString, getFontColor, getRandomColor } from '../logic/utilities';
import { getLabelInputName, getLabelInputColor, getLabelDeleteConfirmation } from '../locales/english';

const TASK_ANIMATION_TYPE = 'flash';
const TASK_ANIMATION_DURATION = 600;
const CARD_STYLE = { marginBottom: '1.2em' };

export const QUEUE_COMPONENT_NAME = 'Queue';
export const NEW_QUEUE_ARIA_LABEL = `New ${QUEUE_COMPONENT_NAME}`;
const VIEW_QUEUE_ICON = 'eye';
const LABEL_VIEW = 'View';
const HTML_ID_INPUT_NAME = 'name';
const HTML_ID_INPUT_COLOR = 'color';
const INPUT_FIELD_INFO_NAME = getLabelInputName(QUEUE_COMPONENT_NAME);
const INPUT_FIELD_INFO_COLOR = getLabelInputColor();

// The queue will be undefined if this is the 'add queue' button instance
function Queue({ queue, handleCreate, handleEdit, handleDelete, handleView, active }) {
  const {id, pendingTasks, name: queueName, color: queueColor} = queue || {};
  const taskCount = (pendingTasks || []).length;

  const [beforeEditValues, setBeforeEditValues] = useState({});
  const [name, setName] = useState(queueName || '');
  const [color, setColor] = useState(queueColor || getRandomColor());
  const [taskCountTransition, setTaskCountTransition] = useState(true);

  useEffect(() => {
    setTaskCountTransition((taskCountTransition) => !taskCountTransition);
  }, [taskCount]);

  const storeBeforeInput = () => {
    setBeforeEditValues({
      name,
      color
    });
  };

  const resetAfterInput = () => {
    setName(beforeEditValues.name);
    setColor(beforeEditValues.color);

    setBeforeEditValues({});
  };

  const onClickView = () => {
    handleView(id);
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

        // Need to manually update values to prevent staleness after creation.
        setName('');
        setColor(getRandomColor());
      }

      setBeforeEditValues({});
    }
  };

  const getLabelStyle = () => {
    const fontColor = getFontColor(color);
    const border = `1px ${fontColor === '#ffffff' ? 'outset white' : 'solid black'}`;

    return {
      backgroundColor: color,
      color: fontColor,
      border,
    };
  };

  const inputHasError = () => {
    return !isHexColorString(color) || !name || name.length < 1;
  };

  const getCardContent = () => {
    return (
      <>
        <div className='ui tiny label' style={{ backgroundColor: color }}/>
        { 
          taskCount > 0 &&
            <Transition
              animation={TASK_ANIMATION_TYPE}
              duration={TASK_ANIMATION_DURATION}
              visible={taskCountTransition}
            >
              <div className='ui circular label floating'
                style={getLabelStyle()}
              >
                {taskCount}
              </div>
            </Transition>
        }
      </>
    );
  };

  const getEditContent = () => {
    return (
      <>
        <Label htmlFor={HTML_ID_INPUT_COLOR}>{INPUT_FIELD_INFO_COLOR}</Label>
        <Input
          id={HTML_ID_INPUT_COLOR}
          type='text'
          title='Enter Hex formatted color string'
          value={color}
          onChange={event => setColor(event.target.value)}
          error={isHexColorString(color) ? undefined : true}
        />
        <Label htmlFor={HTML_ID_INPUT_NAME}>{INPUT_FIELD_INFO_NAME}</Label>
        <Input
          id={HTML_ID_INPUT_NAME}
          type='text'
          value={name}
          onChange={event => setName(event.target.value)}
        />
      </>
    );
  };

  const getDisplayContent = () => {
    return (
      <Card.Content>
        <Card.Header textAlign='center' style={{ overflowWrap: 'break-word' }}>
          {name}
        </Card.Header>
      </Card.Content>
    );
  };

  return (
    <CrudCard
      content={queue}
      componentName={QUEUE_COMPONENT_NAME}
      ariaLabelIdentifier={queue ? queue.name : NEW_QUEUE_ARIA_LABEL}
      getCardContent={getCardContent}
      getEditContent={getEditContent}
      getDisplayContent={getDisplayContent}
      deleteLabel={getLabelDeleteConfirmation(QUEUE_COMPONENT_NAME, name)}
      cardStyle={CARD_STYLE}
      specialButtonIcon={VIEW_QUEUE_ICON}
      specialButtonFunction={onClickView}
      specialButtonLabel={LABEL_VIEW}
      confirmDisabled={inputHasError() ? true : undefined}
      storeBeforeInput={storeBeforeInput}
      resetAfterInput={resetAfterInput}
      deleteHandler={() => handleDelete(id)}
      modalHandler={onModalConfirm}
      enableClick={true}
      enableKeyboardClick={true}
    >
      {
        active &&
          <Icon className={VIEW_QUEUE_ICON} style={{ paddingLeft: '0.3em', paddingBottom: '1.5em' }}/>
      }
    </CrudCard>
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
  handleView: PropTypes.func.isRequired,
  active: PropTypes.bool,
};

export default Queue;
