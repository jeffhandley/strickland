const TAGNAME_INPUT = 'INPUT';
const ATTRIBUTE_TYPE_BUTTON = 'button';
const ATTRIBUTE_TYPE_FILE = 'file';
const ATTRIBUTE_TYPE_RESET = 'reset';
const ATTRIBUTE_TYPE_SUBMIT = 'submit';
const ATTRIBUTE_TYPE_CHECKBOX = 'checkbox';
const ATTRIBUTE_TYPE_RADIO = 'radio';

const TAGNAME_SELECT = 'SELECT';
const ATTRIBUTE_MULTIPLE = 'multiple';

const TAGNAME_TEXTAREA = 'TEXTAREA';

// Elements with these .tagName values are considered fields for user input
const FIELD_TAGNAMES = [TAGNAME_SELECT, TAGNAME_INPUT, TAGNAME_TEXTAREA];

// Elements with these .type values are considered inputs that are buttons
const BUTTON_TYPES = [ATTRIBUTE_TYPE_BUTTON, ATTRIBUTE_TYPE_RESET, ATTRIBUTE_TYPE_SUBMIT];

export const isSelectInput = (element) => element.tagName === TAGNAME_SELECT;
export const isCheckboxInput = (element) => element.tagName === TAGNAME_INPUT && element.type === ATTRIBUTE_TYPE_CHECKBOX;
export const isRadioInput = (element) => element.tagName === TAGNAME_INPUT && element.type === ATTRIBUTE_TYPE_RADIO;
export const isFileInput = (element) => element.tagName === TAGNAME_INPUT && element.type === ATTRIBUTE_TYPE_FILE;

export const isFieldFocusOut = (element) =>
  FIELD_TAGNAMES.includes(element.tagName) &&
  !BUTTON_TYPES.includes(element.type);

export const shouldUseChangeEvent = (element) =>
  isSelectInput(element) ||
  isCheckboxInput(element) ||
  isRadioInput(element) ||
  isFileInput(element);

export const shouldUseChangeEventOnDelay = (element) =>
  isSelectInput(element) && element.attributes[ATTRIBUTE_MULTIPLE];
