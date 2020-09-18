/*
  User facing strings are generated in this file which implements an intermediate solution.
  An ideal localization solution would accept key strings and return the value strings based
  on the currently used language by the browser.
*/

// CrudCard
export const getLabelCreate = (componentType) => {
  return `Create ${componentType}`;
};

export const getLabelToggleButtons = (ariaLabelIdentifier) => {
  return `${ariaLabelIdentifier}: Toggle Buttons`;
};
// ~CrudCard

// Queue
export const getLabelInputName = (componentType) => {
  return `Enter ${componentType} name:`;
};

export const getLabelInputColor = () => {
  return 'Select a color in 3 or 6 digit hex format: #ffffff';
};

export const getLabelDeleteConfirmation = (componentType) => {
  return `Are you sure you want to delete this ${componentType}?`;
}; 
// ~Queue

// Task
export const getLabelSelectParent = (parentObjectType) => {
  return `Choose a ${parentObjectType}`;
};

export const getLabelInputType = (objectType) => {
  return `Enter ${objectType}`;
};

export const getLabelDeleteConfirmationWithParentType = (objectType, parentObjectType, parentName) => {
  return `Are you sure you want to delete this ${objectType}, in ${parentObjectType}: ${parentName}?`;
};
// ~Task

// TaskList
export const getLabelNoPendingObjects = (objectType) => {
  return `You have no pending ${objectType}s!`;
};
// ~TaskList

// QueueList
export const getLabelRadioTop = (objectType) => {
  return `Top ${objectType}s`;
};

export const getLabelRadioAll = (objectType) => {
  return `All ${objectType}s`;
};

export const getLabelRadioView = (objectType) => {
  return `View ${objectType}`;
};

export const getLabelShowCompleted = (objectType) => {
  return `Show completed ${objectType}s`;
};

export const getLabelCantCreate = (parentObjectType, childObjectType) => {
  return `Create a ${parentObjectType} before adding ${childObjectType}s!`;
};
// ~QueueList
