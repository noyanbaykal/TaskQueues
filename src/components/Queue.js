import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Input, Label, Transition } from 'semantic-ui-react';

import { CreateButton } from '../logic/itemCard';
import { DISPLAY_MODES, SHOULD_DISPATCH, SHOULD_DISPLAY, isHexColorString, getFontColor, getRandomColor } from '../logic/utilities';

const TASK_ANIMATION_TYPE = 'flash';
const TASK_ANIMATION_DURATION = 600;

const HTML_ID_INPUT_NAME = 'name';
const HTML_ID_INPUT_COLOR = 'color';
const INPUT_FIELD_INFO_NAME = 'Enter queue name:';
const INPUT_FIELD_INFO_COLOR = 'Select a color in 3 or 6 digit hex format: #ffffff';
const DELETE_CONFIRMATION = 'Are you sure you want to delete this Queue?';

// The queue will be undefined if this is the 'add queue' button instance
function Queue({ queue, handleCreate, handleEdit, handleDelete, handleView, active }) {
  const {id, pendingTasks, name: queueName, color: queueColor} = queue || {};
  const taskCount = (pendingTasks || []).length;

  const [displayMode, setDisplayMode] = useState(SHOULD_DISPLAY(queue));
  const [beforeEditValues, setBeforeEditValues] = useState({});
  const [name, setName] = useState(queueName || '');
  const [color, setColor] = useState(queueColor || getRandomColor());
  const [showButtons, setShowButtons] = useState(false);
  const [taskCountTransition, setTaskCountTransition] = useState(true);

  useEffect(() => {
    setTaskCountTransition((taskCountTransition) => !taskCountTransition);
  }, [taskCount]);

  const onClickCreateOrEdit = () => {
    setBeforeEditValues({
      name,
      color
    });

    setDisplayMode(DISPLAY_MODES.EDIT);
  };

  const onClickCard = () => {
    setShowButtons((showButtons) => !showButtons);
  };

  const onClickView = () => {
    handleView(id);
  };

  const onClickDelete = () => {
    setDisplayMode(DISPLAY_MODES.NEED_CONFIRMATION);
  };

  const onClickCancel = () => {
    if(displayMode === DISPLAY_MODES.EDIT) {
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
        // Need to manually reset text and queueId to prevent staleness after creation.
        setName('');
        setColor(getRandomColor());

        handleCreate(changes);
      }
    }

    setBeforeEditValues({});
    setDisplayMode(SHOULD_DISPLAY(queue));
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
        { taskCount > 0 &&
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
        {
          displayMode === DISPLAY_MODES.EDIT &&
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
        }
        {
          displayMode !== DISPLAY_MODES.EDIT &&
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
    if(displayMode === DISPLAY_MODES.DISPLAY) {
      if(!showButtons) {
        return null;
      }

      return (
        <Card.Content extra>
          <button className='left floated' onClick={onClickCreateOrEdit} style={{ marginRight: '0.65em' }}>
            <Icon className='pencil alternate' />
          </button>
          <button className='left floated' onClick={onClickDelete}>
            <Icon className='trash' />
          </button>
          <button className='right floated' onClick={onClickView}>
            <Icon className='eye'/>
          </button>
        </Card.Content>
      );
    }

    if(displayMode === DISPLAY_MODES.EDIT) {
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
        <button className='left floated' onClick={onConfirm} disabled={inputHasError() ? true : undefined}>
          <Icon className='check' />
        </button>
        <button className='right floated' onClick={onCancel}>
          <Icon className='delete' />
        </button>
      </Card.Content>
    );
  };

  const getCardOnKeyPressHandler = () => {
    if(displayMode === DISPLAY_MODES.DISPLAY) {
      return function(e) {
        if(SHOULD_DISPATCH(e.target === e.currentTarget && e.keyCode)) {
          onClickCard();
        }
      };
    }

    return undefined;
  };

  return (
    <div className={`Queue ${displayMode}`}>
      {
        displayMode === DISPLAY_MODES.NO_CONTENT
        ?
          <CreateButton onCreate={onClickCreateOrEdit}/>
        :
          <Card
            style={{ marginBottom: '1.2em' }}
            onClick={onClickCard}
            tabIndex={displayMode === DISPLAY_MODES.DISPLAY ? 0 : undefined}
            onKeyDown={getCardOnKeyPressHandler()}
          >
            {
              getCardContent()
            }
            {
              active &&
                <Icon className={'eye'} style={{ paddingLeft: '0.3em', paddingBottom: '1.5em' }}/>
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
  handleView: PropTypes.func.isRequired,
  active: PropTypes.bool,
};

export default Queue;
