"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _event = _interopRequireDefault(require("./event"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Emitter = require('tiny-emitter');

const lc = event => event.attributes.range.start.diff(event.attributes.range.end);

const sortEvents = (eventA, eventB) => {
  const a = lc(eventA);
  const b = lc(eventB);
  return a < b ? -1 : a > b ? 1 : 0; // eslint-disable-line no-nested-ternary
};

class EventsCollection {
  constructor() {
    let events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    this.events = [];

    for (let i = 0, length = events.length; i < length; i += 1) {
      this.add(events[i], {
        silent: true
      });
    }
  }

  add(eventAttrs) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const event = eventAttrs instanceof _event.default ? eventAttrs : new _event.default(eventAttrs);
    event.collection = this;
    this.events.push(event);

    if (!options.silent) {
      this.emit('change');
    }

    return event;
  }

  forEach(fn) {
    this.events.sort(sortEvents).forEach(fn);
  }

  get length() {
    return this.events.length;
  }

  at(i) {
    return this.events[i];
  }

  remove(event) {
    const index = this.events.indexOf(event);

    if (-1 !== index) {
      this.events.splice(index, 1);
      this.emit('change');
    }
  }

}

exports.default = EventsCollection;
EventsCollection.Event = _event.default;
Object.assign(EventsCollection.prototype, Emitter.prototype);