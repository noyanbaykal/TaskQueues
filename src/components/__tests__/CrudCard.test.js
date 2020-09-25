import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Card, Input, Label } from 'semantic-ui-react';

import CrudCard, {
  GET_BUTTON_ARIA_LABEL, ARIA_LABEL_CONFIRM, ARIA_LABEL_CANCEL, ARIA_LABEL_EDIT, ARIA_LABEL_DELETE
} from '../CrudCard';
import { getLabelCreate, getLabelToggleButtons } from '../../locales/english';

const COMPONENT_NAME = 'testComponent';
const ARIA_LABEL = 'CTHULHU FHTAGN';
const SPECIAL_BUTTON_LABEL = 'Reality Bath';
const SPECIAL_BUTTON_ICON = 'Eye';
const BUTTON_LABEL_CREATE = getLabelCreate(COMPONENT_NAME);
const BUTTON_LABEL_CARD = getLabelToggleButtons(ARIA_LABEL);
const BUTTON_LABEL_CONFIRM = GET_BUTTON_ARIA_LABEL(ARIA_LABEL, ARIA_LABEL_CONFIRM);
const BUTTON_LABEL_CANCEL = GET_BUTTON_ARIA_LABEL(ARIA_LABEL, ARIA_LABEL_CANCEL);
const BUTTON_LABEL_EDIT = GET_BUTTON_ARIA_LABEL(ARIA_LABEL, ARIA_LABEL_EDIT);
const BUTTON_LABEL_DELETE = GET_BUTTON_ARIA_LABEL(ARIA_LABEL, ARIA_LABEL_DELETE);
const BUTTON_LABEL_SPECIAL = GET_BUTTON_ARIA_LABEL(ARIA_LABEL, SPECIAL_BUTTON_LABEL);

const BUTTON_REGEX_CREATE = new RegExp(BUTTON_LABEL_CREATE, 'i');
const BUTTON_REGEX_CONFIRM = new RegExp(BUTTON_LABEL_CONFIRM, 'i');
const BUTTON_REGEX_CANCEL = new RegExp(BUTTON_LABEL_CANCEL, 'i');
const BUTTON_REGEX_EDIT = new RegExp(BUTTON_LABEL_EDIT, 'i');
const BUTTON_REGEX_DELETE = new RegExp(BUTTON_LABEL_DELETE, 'i');
const BUTTON_REGEX_SPECIAL = new RegExp(BUTTON_LABEL_SPECIAL, 'i');
const CARD_REGEX = new RegExp(BUTTON_LABEL_CARD, 'i');

const DEFAULT_CONTENT = {
  name: 'test',
};

const TRANSITION_CLASS = 'jiggle';
const CARD_TRANSITION = (visible) => {
  return {
    type: TRANSITION_CLASS,
    duration: 500,
    visible
  };
};
const DELETE_LABEL = 'Confirm deletion?';
const SMALL_OFFSET = '1.2em';
const CARD_STYLE = () => {
  return {
    marginBottom: SMALL_OFFSET,
  };
};
const VERIFY_CARD_STYLE = (style) => {
  return style && style['_values'] && style['_values']['margin-bottom'] === SMALL_OFFSET;
}
const EDIT_INPUT_LABEL = 'Editing';
const GET_EDIT_CONTENT = () => {
  const inputId = 'testInput';
  const value = 'test';

  return (
    <>
      <Label htmlFor={inputId}>{EDIT_INPUT_LABEL}</Label>
      <Input
        id={inputId}
        type='text'
        value={value}
      />
    </>
  );
}
const DISPLAY_LABEL = 'Testing display';
const GET_DISPLAY_CONTENT = () => {
  return (
    <Card.Content>
      <Card.Header>
        {DISPLAY_LABEL}
      </Card.Header>
    </Card.Content>
  );
};

// Setup functions
const getCrudCard = (props) => {
  const {children, ...others} = props;

  return (
    <CrudCard
      componentName={COMPONENT_NAME}
      ariaLabelIdentifier={ARIA_LABEL}
      deleteLabel={DELETE_LABEL}
      cardStyle={CARD_STYLE()}
      {...others}
    >
      { children }
    </CrudCard>
  );
};

const renderDefaultCrudCard = (props) => {
  const storeBeforeInput = jest.fn();
  const resetAfterInput = jest.fn();
  const deleteHandler = jest.fn();
  const modalHandler = jest.fn(); 

  render(
    getCrudCard({
      getEditContent: GET_EDIT_CONTENT,
      getDisplayContent: GET_DISPLAY_CONTENT,
      storeBeforeInput,
      resetAfterInput,
      deleteHandler,
      modalHandler,
      ...props,
    })
  );

  return {
    storeBeforeInput,
    resetAfterInput,
    deleteHandler,
    modalHandler,
  }
}
// ~Setup functions

// CrudCard without content
test('displays no content state', () => {
  renderDefaultCrudCard();

  screen.getByRole('button', { name: BUTTON_REGEX_CREATE });
});

test('add button initiates edit mode', () => {
  renderDefaultCrudCard();

  const addButton = screen.getByRole('button', { name: BUTTON_REGEX_CREATE });
  fireEvent.click(addButton);

  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_CREATE })).toThrow();
  screen.getByRole('button', { name: BUTTON_REGEX_CONFIRM });
  screen.getByRole('button', { name: BUTTON_REGEX_CANCEL });
});

// check that storeBeforeInput is called when swithing to edit mode & resetAfterInput is called if edit is cancelled
test('cancelled create flow resets fields', () => {
  const { storeBeforeInput, resetAfterInput } = renderDefaultCrudCard();

  expect(storeBeforeInput).not.toHaveBeenCalled();
  expect(resetAfterInput).not.toHaveBeenCalled();

  const addButton = screen.getByRole('button', { name: BUTTON_REGEX_CREATE });
  fireEvent.click(addButton);

  expect(storeBeforeInput).toHaveBeenCalled();
  expect(resetAfterInput).not.toHaveBeenCalled();

  const cancelButton = screen.getByRole('button', { name: BUTTON_REGEX_CANCEL });
  fireEvent.click(cancelButton);

  expect(resetAfterInput).toHaveBeenCalled();

  screen.getByRole('button', { name: BUTTON_REGEX_CREATE });
  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_CONFIRM })).toThrow();
  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_CANCEL })).toThrow();
});

test('modal handler is called during create flow', () => {
  const { modalHandler } = renderDefaultCrudCard();
  
  const addButton = screen.getByRole('button', { name: BUTTON_REGEX_CREATE });
  fireEvent.click(addButton);

  expect(modalHandler).not.toHaveBeenCalled();

  const confirmButton = screen.getByRole('button', { name: BUTTON_REGEX_CONFIRM });
  fireEvent.click(confirmButton);

  expect(modalHandler).toHaveBeenCalled();
});
// ~CrudCard without content

// Checking the presence of content
test('children are present', () => {
  const buttonLabel = GET_BUTTON_ARIA_LABEL(ARIA_LABEL, 'ph\'nglui mglw\'nafh');
  const buttonRegex = new RegExp(buttonLabel, 'i');

  const children = (
    <button
        aria-label={buttonLabel}
        className='left floated'
    />
  );

  renderDefaultCrudCard({ children, content: DEFAULT_CONTENT });

  screen.getByRole('button', { name: buttonRegex })
});

test('content is present', () => {
  renderDefaultCrudCard({ content: DEFAULT_CONTENT });
  
  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_CREATE })).toThrow();
});

test('card transition is present', () => {
  renderDefaultCrudCard({ content: DEFAULT_CONTENT, cardTransition: CARD_TRANSITION(true) });

  const card = screen.getByRole('button', { name: CARD_REGEX });

  expect(card.className.includes(TRANSITION_CLASS)).toBe(true);
});

test('getCardContent is called', () => {
  const getCardContentFunc = jest.fn();

  renderDefaultCrudCard({ content: DEFAULT_CONTENT, getCardContent: getCardContentFunc });

  expect(getCardContentFunc).toHaveBeenCalled();
});

test('getEditContent is called', () => {
  const getEditContentFunc = jest.fn();

  renderDefaultCrudCard({ content: DEFAULT_CONTENT, getEditContent: getEditContentFunc, enableClick: true, enableKeyboardClick: true });

  expect(getEditContentFunc).not.toHaveBeenCalled();

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.click(card);

  const editButton = screen.getByRole('button', { name: BUTTON_REGEX_EDIT });
  fireEvent.click(editButton);

  expect(getEditContentFunc).toHaveBeenCalled();
});

test('getDisplayContent is called', () => {
  const getDisplayContentFunc = jest.fn();

  renderDefaultCrudCard({ content: DEFAULT_CONTENT, getDisplayContent: getDisplayContentFunc });

  expect(getDisplayContentFunc).toHaveBeenCalled();
});

test('cardStyle prop is applied', () => {
  renderDefaultCrudCard({ content: DEFAULT_CONTENT });

  const card = screen.getByRole('button', { name: CARD_REGEX });

  expect(VERIFY_CARD_STYLE(card.style)).toBe(true);
});
// ~Checking the presence of content

// Checking card click
test('card click disabled', () => {
  renderDefaultCrudCard({ content: DEFAULT_CONTENT, enableKeyboardClick: true,
    specialButtonIcon: SPECIAL_BUTTON_ICON, specialButtonLabel: SPECIAL_BUTTON_LABEL,
  });

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.click(card);

  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_EDIT })).toThrow();
  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_DELETE })).toThrow();
  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_SPECIAL })).toThrow();
});

test('card keyboard click disabled', () => {
  renderDefaultCrudCard({ content: DEFAULT_CONTENT, enableClick: true,
    specialButtonIcon: SPECIAL_BUTTON_ICON, specialButtonLabel: SPECIAL_BUTTON_LABEL,
  });

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.keyDown(card, {
    key: 'Enter',
    keyCode: 13,
  });

  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_EDIT })).toThrow();
  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_DELETE })).toThrow();
  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_SPECIAL })).toThrow();
});

test('card click displays buttons', () => {
  renderDefaultCrudCard({ content: DEFAULT_CONTENT, enableClick: true, enableKeyboardClick: true,
    specialButtonIcon: SPECIAL_BUTTON_ICON, specialButtonLabel: SPECIAL_BUTTON_LABEL,
  });

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.click(card);

  screen.getByRole('button', { name: BUTTON_REGEX_EDIT });
  screen.getByRole('button', { name: BUTTON_REGEX_DELETE });
  screen.getByRole('button', { name: BUTTON_REGEX_SPECIAL });
});

test('card keyboard click displays buttons', () => {
  renderDefaultCrudCard({ content: DEFAULT_CONTENT, enableClick: true, enableKeyboardClick: true,
    specialButtonIcon: SPECIAL_BUTTON_ICON, specialButtonLabel: SPECIAL_BUTTON_LABEL,
  });

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.keyDown(card, {
    key: 'Enter',
    keyCode: 13,
  });

  screen.getByRole('button', { name: BUTTON_REGEX_EDIT });
  screen.getByRole('button', { name: BUTTON_REGEX_DELETE });
  screen.getByRole('button', { name: BUTTON_REGEX_SPECIAL });
});

test('special button attributes are applied', () => {
  renderDefaultCrudCard({ content: DEFAULT_CONTENT, enableClick: true, enableKeyboardClick: true,
    specialButtonIcon: SPECIAL_BUTTON_ICON, specialButtonLabel: SPECIAL_BUTTON_LABEL
  });

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.click(card);

  const specialButton = screen.getByRole('button', { name: BUTTON_REGEX_SPECIAL });
  expect(specialButton['children'][0]['className'].includes(SPECIAL_BUTTON_ICON)).toBe(true);
});

test('second card click hides buttons', () => {
  renderDefaultCrudCard({ content: DEFAULT_CONTENT, enableClick: true, enableKeyboardClick: true,
    specialButtonIcon: SPECIAL_BUTTON_ICON, specialButtonLabel: SPECIAL_BUTTON_LABEL,
  });

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.click(card);

  screen.getByRole('button', { name: BUTTON_REGEX_EDIT });
  screen.getByRole('button', { name: BUTTON_REGEX_DELETE });
  screen.getByRole('button', { name: BUTTON_REGEX_SPECIAL });

  fireEvent.click(card);

  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_EDIT })).toThrow();
  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_DELETE })).toThrow();
  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_SPECIAL })).toThrow();
});

test('second card keyboard click hides buttons', () => {
  renderDefaultCrudCard({ content: DEFAULT_CONTENT, enableClick: true, enableKeyboardClick: true,
    specialButtonIcon: SPECIAL_BUTTON_ICON, specialButtonLabel: SPECIAL_BUTTON_LABEL,
  });

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.keyDown(card, {
    key: 'Enter',
    keyCode: 13,
  });

  screen.getByRole('button', { name: BUTTON_REGEX_EDIT });
  screen.getByRole('button', { name: BUTTON_REGEX_DELETE });
  screen.getByRole('button', { name: BUTTON_REGEX_SPECIAL });

  fireEvent.keyDown(card, {
    key: 'Enter',
    keyCode: 13,
  });

  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_EDIT })).toThrow();
  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_DELETE })).toThrow();
  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_SPECIAL })).toThrow();
});
// ~Checking card click

// Edit flow
test('confirmDisabled disables the confirm button', () => {
  const getEditContentFunc = jest.fn();

  renderDefaultCrudCard({ content: DEFAULT_CONTENT, enableClick: true, enableKeyboardClick: true,
    getEditContent: getEditContentFunc, confirmDisabled: true,
  });

  expect(getEditContentFunc).not.toHaveBeenCalled();

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.click(card);

  const editButton = screen.getByRole('button', { name: BUTTON_REGEX_EDIT });
  fireEvent.click(editButton);

  expect(getEditContentFunc).toHaveBeenCalled();

  const confirmButton = screen.getByRole('button', { name: BUTTON_REGEX_CONFIRM });

  expect(confirmButton).toBeDisabled();
});

test('cancelled edit flow resets fields', () => {
  const { storeBeforeInput, resetAfterInput } = renderDefaultCrudCard({ content: DEFAULT_CONTENT, enableClick: true, enableKeyboardClick: true, });

  expect(storeBeforeInput).not.toHaveBeenCalled();
  expect(resetAfterInput).not.toHaveBeenCalled();

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.click(card);

  const editButton = screen.getByRole('button', { name: BUTTON_REGEX_EDIT });
  fireEvent.click(editButton);

  expect(storeBeforeInput).toHaveBeenCalled();
  expect(resetAfterInput).not.toHaveBeenCalled();

  const cancelButton = screen.getByRole('button', { name: BUTTON_REGEX_CANCEL });
  fireEvent.click(cancelButton);

  expect(storeBeforeInput).toHaveBeenCalled();
  expect(resetAfterInput).toHaveBeenCalled();
});

test('modal handler is called', () => {
  const { modalHandler } = renderDefaultCrudCard({ content: DEFAULT_CONTENT, enableClick: true, enableKeyboardClick: true, });

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.click(card);

  const editButton = screen.getByRole('button', { name: BUTTON_REGEX_EDIT });
  fireEvent.click(editButton);

  expect(modalHandler).not.toHaveBeenCalled();

  const confirmButton = screen.getByRole('button', { name: BUTTON_REGEX_CONFIRM });
  fireEvent.click(confirmButton);

  expect(modalHandler).toHaveBeenCalled();
});
// ~Edit flow

// Delete flow
test('trash button initiates confirmation mode', () => {
  const { deleteHandler } = renderDefaultCrudCard({ content: DEFAULT_CONTENT, enableClick: true, enableKeyboardClick: true, });

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.click(card);

  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_CONFIRM })).toThrow();
  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_CANCEL })).toThrow();

  const deleteButton = screen.getByRole('button', { name: BUTTON_REGEX_DELETE });
  fireEvent.click(deleteButton);

  screen.getByRole('button', { name: BUTTON_REGEX_CONFIRM });
  screen.getByRole('button', { name: BUTTON_REGEX_CANCEL });

  expect(deleteHandler).not.toHaveBeenCalled();
});

test('delete label is displayed', () => {
  renderDefaultCrudCard({ content: DEFAULT_CONTENT, enableClick: true, enableKeyboardClick: true, });

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.click(card);
  
  expect(() => screen.getByText(DELETE_LABEL)).toThrow();

  const deleteButton = screen.getByRole('button', { name: BUTTON_REGEX_DELETE });
  fireEvent.click(deleteButton);

  screen.getByText(DELETE_LABEL);
});

test('delete handler is called', () => {
  const { deleteHandler } = renderDefaultCrudCard({ content: DEFAULT_CONTENT, enableClick: true, enableKeyboardClick: true, });

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.click(card);

  const deleteButton = screen.getByRole('button', { name: BUTTON_REGEX_DELETE });
  fireEvent.click(deleteButton);

  expect(deleteHandler).not.toHaveBeenCalled();

  const confirmButton = screen.getByRole('button', { name: BUTTON_REGEX_CONFIRM });
  fireEvent.click(confirmButton);

  expect(deleteHandler).toHaveBeenCalled();
});

test('cancel transitions out of confirmation mode', () => {
  const { deleteHandler } = renderDefaultCrudCard({ content: DEFAULT_CONTENT, enableClick: true, enableKeyboardClick: true, });

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.click(card);

  const deleteButton = screen.getByRole('button', { name: BUTTON_REGEX_DELETE });
  fireEvent.click(deleteButton);

  const cancelButton = screen.getByRole('button', { name: BUTTON_REGEX_CANCEL });
  fireEvent.click(cancelButton);

  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_CONFIRM })).toThrow();
  expect(() => screen.getByRole('button', { name: BUTTON_REGEX_CANCEL })).toThrow();
  screen.getByRole('button', { name: BUTTON_REGEX_EDIT });
  screen.getByRole('button', { name: BUTTON_REGEX_DELETE });

  expect(deleteHandler).not.toHaveBeenCalled();
});
// ~Delete flow

// Special function button
test('special button function handler is called', () => {
  const specialButtonFunction = jest.fn();

  renderDefaultCrudCard({ content: DEFAULT_CONTENT, enableClick: true, enableKeyboardClick: true,
    specialButtonIcon: SPECIAL_BUTTON_ICON, specialButtonLabel: SPECIAL_BUTTON_LABEL, specialButtonFunction
  });

  const card = screen.getByRole('button', { name: CARD_REGEX });
  fireEvent.click(card);

  expect(specialButtonFunction).not.toHaveBeenCalled();

  const specialButton = screen.getByRole('button', { name: BUTTON_REGEX_SPECIAL });
  fireEvent.click(specialButton);

  expect(specialButtonFunction).toHaveBeenCalled();
});
// ~Special function button
