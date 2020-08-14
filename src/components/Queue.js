import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Input, Label } from 'semantic-ui-react';

import { DISPLAY_MODES, SHOULD_DISPLAY, getFontColor, getRandomColor } from '../logic/utilities';

const HTML_ID_INPUT_NAME = 'name';
const HTML_ID_INPUT_COLOR = 'color';
const INPUT_FIELD_INFO_NAME = 'Enter queue name:';
const INPUT_FIELD_INFO_COLOR = 'Select a color in hex format: #ffffff';
const DELETE_CONFIRMATION = 'Are you sure you want to delete this Queue?';

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

    setDisplayMode(DISPLAY_MODES.EDIT);
  };

  const onClickView = () => {
    // TODO
    // set buttons?
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

  const getCardContent = () => {
    return (
      <>
        <div className='ui tiny label' style={{ backgroundColor: color }}/>
        { taskCount > 0 &&
          <div className='ui circular label floating'
            style={getLabelStyle()}
          >
            {taskCount}
          </div>
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
    <div className={`Queue ${displayMode}`} style={{ textAlign: 'center' }}> {/* textAlign needed to horizontally center the plus button */}
      {
        displayMode === DISPLAY_MODES.NO_CONTENT
        ?
          <button onClick={onClickCreateOrEdit} style={{ display: 'inline-block', margin: '0 auto' }}>
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
