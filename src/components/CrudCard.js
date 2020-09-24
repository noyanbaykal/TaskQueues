import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Label, Transition } from 'semantic-ui-react';

import { getLabelCreate, getLabelToggleButtons } from '../locales/english';

export const GET_BUTTON_ARIA_LABEL = (ariaLabel, buttonLabel) => {
  return `${ariaLabel}: ${buttonLabel}`;
};

export const ARIA_LABEL_CONFIRM = 'Confirm';
export const ARIA_LABEL_CANCEL = 'Cancel';
export const ARIA_LABEL_EDIT = 'Edit';
export const ARIA_LABEL_DELETE = 'Delete';

function CreateButton({ onCreate, ariaLabel }) {
  const BACKGROUND_COLOR = 'rgb(239, 239, 239)';
  const BACKGROUND_COLOR_HOVERED = 'rgb(210, 210, 210)';

  const [color, setColor] = useState(BACKGROUND_COLOR);

  return (
    <Card style={{ textAlign: 'center', boxShadow: 'none'}}>
      <button
        aria-label={ariaLabel}
        onClick={onCreate}
        style={{ margin: '0 auto', backgroundColor: color }}
        onMouseEnter={() => setColor(BACKGROUND_COLOR_HOVERED)}
        onMouseLeave={() => setColor(BACKGROUND_COLOR)}
      >
        <Icon className='plus circle'/>
      </button>
    </Card>
  );
};

const KEY_CODE_ENTER = 13;
const KEY_CODE_SPACE = 32;

const SHOULD_DISPATCH = (keyCode) => {
  return keyCode === KEY_CODE_ENTER || keyCode === KEY_CODE_SPACE;
};

const DISPLAY_MODES = Object.freeze({
  NO_CONTENT: 'noContent',
  EDIT: 'edit',
  DISPLAY: 'display',
  NEED_CONFIRMATION: 'needConfirmation',
});

const SHOULD_DISPLAY = (content) => {
  return content ? DISPLAY_MODES.DISPLAY : DISPLAY_MODES.NO_CONTENT;
};

const getCardDisplayButtons = (editFunction, deleteFunction, specialButtonIcon, handleSpecial, ariaLabelIdentifier, specialButtonLabel) => {
  return (
    <Card.Content extra>
      <button
        aria-label={GET_BUTTON_ARIA_LABEL(ariaLabelIdentifier, ARIA_LABEL_EDIT)}
        onClick={editFunction}
        style={{ marginRight: '0.65em' }}
      >
        <Icon className='pencil alternate' />
      </button>
      <button
        aria-label={GET_BUTTON_ARIA_LABEL(ariaLabelIdentifier, ARIA_LABEL_DELETE)}
        onClick={deleteFunction}
      >
        <Icon className='trash' />
      </button>
      {
        handleSpecial &&
          <button
            aria-label={GET_BUTTON_ARIA_LABEL(ariaLabelIdentifier, specialButtonLabel)}
            className='right floated'
            onClick={handleSpecial}
          >
            <Icon className={specialButtonIcon}/>
          </button>
      }
    </Card.Content>
  );
};

const getConfirmationButtons = (onConfirm, onCancel, confirmDisabled, ariaLabelIdentifier) => {
  return (
    <Card.Content extra>
      <button
        aria-label={GET_BUTTON_ARIA_LABEL(ariaLabelIdentifier, ARIA_LABEL_CONFIRM)}
        className='left floated'
        onClick={onConfirm}
        disabled={confirmDisabled}
      >
        <Icon className='check' />
      </button>
      <button
        aria-label={GET_BUTTON_ARIA_LABEL(ariaLabelIdentifier, ARIA_LABEL_CANCEL)}
        className='right floated'
        onClick={onCancel}
      >
        <Icon className='delete' />
      </button>
    </Card.Content>
  );
};

function CrudCard(props) {
  const {
    children, content, componentName, ariaLabelIdentifier, cardTransition, getCardContent, getEditContent, getDisplayContent,
    deleteLabel, cardStyle, specialButtonIcon, specialButtonFunction, specialButtonAfterFunction, specialButtonLabel,
    confirmDisabled, storeBeforeInput, resetAfterInput, deleteHandler, modalHandler, enableClick, enableKeyboardClick,
  } = props;

  const LABEL_CREATE = getLabelCreate(componentName);
  const LABEL_TOGGLE_BUTTONS = getLabelToggleButtons(ariaLabelIdentifier);

  const [displayMode, setDisplayMode] = useState(SHOULD_DISPLAY(content));
  const [showButtons, setShowButtons] = useState(false);

  const onClickCreateOrEdit = () => {
    storeBeforeInput();

    setDisplayMode(DISPLAY_MODES.EDIT);
  };
  
  const onClickDelete = () => {
    setDisplayMode(DISPLAY_MODES.NEED_CONFIRMATION);
  };
  
  const handleConfirm = () => {
    modalHandler();

    setDisplayMode(SHOULD_DISPLAY(content));
  };
  
  const handleCancel = () => {
    if(displayMode === DISPLAY_MODES.EDIT) {
      resetAfterInput();
    }

    setDisplayMode(SHOULD_DISPLAY(content));
  };

  const handleDelete = () => {
    setDisplayMode(SHOULD_DISPLAY(content));

    deleteHandler();
  };

  const handleSpecial = () => {
    if(!specialButtonIcon || !specialButtonFunction) {
      return undefined;
    }

    specialButtonFunction();

    if(specialButtonAfterFunction && cardTransition) {
      const { duration } = cardTransition;

      setTimeout(() => {
        setDisplayMode(SHOULD_DISPLAY(content));
  
        specialButtonAfterFunction();
      }, duration);
    }
  };

  const composeCardContent = () => {
    return (
      <>
        { 
          getCardContent &&
            getCardContent()
        }
        {
          displayMode === DISPLAY_MODES.EDIT &&
            <>
              { getEditContent() }
            </>
        }
        {
          displayMode !== DISPLAY_MODES.EDIT &&
            <>
              { getDisplayContent() }
            </>
        }
        {
          displayMode === DISPLAY_MODES.NEED_CONFIRMATION &&
            <Label>{ deleteLabel }</Label>
        }
      </>
    );
  }

  const getCardExtraContent = () => {
    if(displayMode === DISPLAY_MODES.DISPLAY) {
      if(!showButtons) {
        return null;
      }
      
      return getCardDisplayButtons(onClickCreateOrEdit, onClickDelete, specialButtonIcon, handleSpecial, ariaLabelIdentifier, specialButtonLabel);
    }
  
    if(displayMode === DISPLAY_MODES.EDIT) {
      return getConfirmationButtons(handleConfirm, handleCancel, confirmDisabled, ariaLabelIdentifier);
    }
  
    if(displayMode === DISPLAY_MODES.NEED_CONFIRMATION) {
      return getConfirmationButtons(handleDelete, handleCancel, undefined, ariaLabelIdentifier);
    }
  
    return null;
  };

  // Semantic applies a hover effect to cards with onClick handlers set.
  // Unclickable cards should not have this effect.
  const getOnClick = () => {
    if(!enableClick) {
      return undefined;
    }

    return function() {
      handleClickCard();
    }
  };

  const getOnKeyboardClick = (e) => {
    if(!enableClick || !enableKeyboardClick) {
      return undefined;
    }

    return function(e) {
      if(e.target === e.currentTarget && SHOULD_DISPATCH(e.keyCode) && displayMode === DISPLAY_MODES.DISPLAY) {
        handleClickCard();
      } 
    }
  };

  const handleClickCard = () => {
    setShowButtons((showButtons) => !showButtons);
  }

  const getCard = () => {
    return (
      <Card
        aria-label={LABEL_TOGGLE_BUTTONS}
        role={'button'}
        style={cardStyle}
        onClick={getOnClick()}
        tabIndex={enableClick && enableKeyboardClick && displayMode === DISPLAY_MODES.DISPLAY ? 0 : undefined}
        onKeyDown={getOnKeyboardClick()}
      >
        { composeCardContent() }
        { children }
        { getCardExtraContent() }
      </Card>
    );
  }

  const showContent = () => {
    if(cardTransition) {
      const { type, duration, visible } = cardTransition;

      return (
        <Transition
          animation={type}
          duration={duration}
          visible={visible}
        >
          { getCard() }
        </Transition>
      );
    } else {
      return getCard();
    }
  };

  return (
    <div className={`${componentName} ${displayMode}`}>
      {
        displayMode === DISPLAY_MODES.NO_CONTENT
        ?
          <CreateButton onCreate={onClickCreateOrEdit} ariaLabel={LABEL_CREATE}/>
        :
          showContent()
      }
    </div>
  );
}

CrudCard.propTypes = {
  children: PropTypes.node,
  content: PropTypes.object,
  componentName: PropTypes.string.isRequired,
  ariaLabelIdentifier: PropTypes.string,
  cardTransition: PropTypes.shape({
    type: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
  }),
  getCardContent: PropTypes.func,
  getEditContent: PropTypes.func.isRequired,
  getDisplayContent: PropTypes.func.isRequired,
  deleteLabel: PropTypes.string.isRequired,
  cardStyle: PropTypes.object,
  specialButtonIcon: PropTypes.string,
  specialButtonFunction: PropTypes.func,
  specialButtonAfterFunction: PropTypes.func,
  specialButtonLabel: PropTypes.string,
  confirmDisabled: PropTypes.bool,
  storeBeforeInput: PropTypes.func.isRequired,
  resetAfterInput: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  modalHandler: PropTypes.func.isRequired,
  enableClick: PropTypes.bool,
  enableKeyboardClick: PropTypes.bool,
};

export default CrudCard;
