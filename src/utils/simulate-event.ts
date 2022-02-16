import { allEventIdsTypes, eventList } from './shared';

export function getEventObj<T extends EventInit>(name: allEventIdsTypes, params: T): Event {
  const eventType = eventList.find((e) => e.id === name)?.type ?? '';
  let event: Event;

  switch (eventType) {
    case 'mouse-event':
      event = new MouseEvent(name, { ...params, view: window });
      break;
    case 'focus-event':
      event = new FocusEvent(name, params);
      break;
    case 'touch-event':
      event = new TouchEvent(name, params);
      break;
    case 'keyboard-event':
      event = new KeyboardEvent(name, params);
      break;
    case 'wheel-event':
      event = new WheelEvent(name, params);
      break;
    case 'input-event':
      event = new InputEvent(name, params);
      break;
    default:
      event = new Event(name, params);
  }

  return event;
}

export default function <T extends EventInit>(element: HTMLElement, name: allEventIdsTypes, params: T) {
  const event = getEventObj(name, params);
  const useNativeEvents = ['focus', 'submit', 'blur'];

  if (useNativeEvents.includes(name) && element[name]) {
    element[name]();
  } else {
    element.dispatchEvent(event);
  }
}
