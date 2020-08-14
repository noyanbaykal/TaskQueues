export const DISPLAY_MODES = Object.freeze({
  NO_CONTENT: 'noContent',
  EDIT: 'edit',
  DISPLAY: 'display',
  NEED_CONFIRMATION: 'needConfirmation',
})

export const SHOULD_DISPLAY = (content) => {
  return content ? DISPLAY_MODES.DISPLAY : DISPLAY_MODES.NO_CONTENT;
}

export const isHexColorString = (string) => {
  return /^#([A-Fa-f0-9]{3}$)|([A-Fa-f0-9]{6}$)/.test(string);
}

const HEX_STRING_LENGTH = 7;
const HEX = 16;

export const getRandomColor = () => {
  let hex = `#${Math.floor(Math.random()*16777215).toString(HEX)}`;
  return hex.padEnd(HEX_STRING_LENGTH, '0');
}

// https://stackoverflow.com/a/1855903
export const getFontColor = (hexColor) => {
  const r = parseInt(hexColor.substring(1, 3), HEX);
  const g = parseInt(hexColor.substring(3, 5), HEX);
  const b = parseInt(hexColor.substring(5, 7), HEX);

  let luminance = ( 0.299 * r + 0.587 * g + 0.114 * b ) / 255;

  return luminance > 0.5
    ? '#000000'   // bright colors - black font
    : '#ffffff';  // dark colors - white font
}

export const findItem = (array, key, value) => {
  for(let i = 0; i < array.length; i++) {
    if(array[i][key] === value) {
      return array[i];
    }
  }

  return undefined;
}
