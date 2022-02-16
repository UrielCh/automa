/* eslint-disable no-param-reassign */
import simulateEvent from './simulate-event';

type InputType = 'text-field' | 'checkbox' | 'radio' | 'select';

function formEvent(element: HTMLInputElement, data: {type: InputType, value: string | boolean, isEditable?: boolean}) {
  if (data.type === 'text-field') {
    const code = /\s/.test(data.value as string)
      ? 'Space'
      : `key${(data.value as string).toUpperCase()}`;

    simulateEvent(element, 'keydown', {
      code,
      bubbles: true,
      cancelable: true,
      key: data.value,
    });
    simulateEvent(element, 'keyup', {
      code,
      bubbles: true,
      cancelable: true,
      key: data.value,
    });
  }

  simulateEvent(element, 'input', {
    inputType: 'insertText',
    data: data.value,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(
    new Event('change', { bubbles: true, cancelable: true })
  );
}
function inputText({ data, element, isEditable = false, index = 0, callback }) {
  const noDelay = data.delay === 0;
  const currentChar = data.value[index] ?? '';
  const elementKey = isEditable ? 'textContent' : 'value';

  element[elementKey] += noDelay ? data.value : currentChar;

  formEvent(element, { type: 'text-field', value: currentChar, isEditable });

  if (!noDelay && index + 1 !== data.value.length) {
    setTimeout(() => {
      inputText({ data, element, callback, isEditable, index: index + 1 });
    }, data.delay);
  } else {
    callback();
  }
}

export default function (element: HTMLInputElement, data: {type: InputType, value: string, clearValue?: boolean, selected?: boolean, isEditable?: boolean}, callback) {
  const textFields = ['INPUT', 'TEXTAREA'];
  const isEditable =
    element.hasAttribute('contenteditable') && element.isContentEditable;

  if (isEditable) {
    if (data.clearValue) element.innerText = '';

    inputText({ data, element, callback, isEditable });
    return;
  }

  if (data.type === 'text-field' && textFields.includes(element.tagName)) {
    if (data.clearValue) element.value = '';

    inputText({ data, element, callback });
    return;
  }

  if (data.type === 'checkbox' || data.type === 'radio') {
    element.checked = data.selected as boolean;
    formEvent(element, { type: data.type, value: data.selected as boolean});
    callback(element.checked);
    return;
  }

  if (data.type === 'select') {
    element.value = data.value;
    formEvent(element, data);
    callback(element.value);
    return;
  }

  callback('');
}
