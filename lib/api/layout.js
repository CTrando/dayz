"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _duration = _interopRequireDefault(require("./duration"));

var _constants = _interopRequireDefault(require("./constants"));

var _momentRange = _interopRequireDefault(require("../moment-range"));

var _eventsCollection = _interopRequireDefault(require("./events-collection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function cacheKey(day) {
  return day.format('YYYYMMDD');
}

function highlightedDaysFinder(days) {
  const highlighted = Object.create(null);
  days.forEach(d => {
    highlighted[cacheKey((0, _momentRange.default)(d))] = true;
  });
  return day => highlighted[cacheKey(day)] ? 'highlight' : false;
} // a layout describes how the calendar is displayed.


class Layout {
  constructor(options) {
    this.cache = Object.create(null);
    options.date = (0, _momentRange.default)(options.date);
    Object.assign(this, options);
    const cacheMethod = 'day' === this.display ? 'addtoDaysCache' : 'calculateDurations';
    this.calculateRange();

    if (!this.isDisplayingAsMonth && !this.displayHours) {
      this.displayHours = this.hourRange();
    } else {
      this.displayHours = this.displayHours || [0, 24];
    }

    if (options.highlightDays) {
      this.isDayHighlighted = 'function' === typeof options.highlightDays ? options.highlightDays : highlightedDaysFinder(options.highlightDays);
    }

    let multiDayCount = 0;

    if (!this.events) {
      this.events = new _eventsCollection.default();
    }

    const range = this.range;
    this.events.forEach(event => {
      // we only care about events that are in the range we were provided
      if (range.overlaps(event.range())) {
        this[cacheMethod](event);

        if (!event.isSingleDay()) {
          multiDayCount += 1;
        }
      }
    });
    this.multiDayCount = multiDayCount;
    this.calculateStacking();
  }

  calculateRange() {
    if (this.range) {
      return;
    }

    this.range = _momentRange.default.range((0, _momentRange.default)(this.date).startOf(this.display), (0, _momentRange.default)(this.date).endOf(this.display));

    if (this.isDisplayingAsMonth) {
      this.range.start.subtract(this.range.start.weekday(), 'days');
      this.range.end.add(6 - this.range.end.weekday(), 'days');
    }
  }

  minutesInDay() {
    return (this.displayHours[1] - this.displayHours[0]) * 60;
  }

  propsForDayContainer(_ref) {
    let day = _ref.day,
        position = _ref.position;
    const classes = ['day'];

    if (this.isDateOutsideRange(day)) {
      classes.push('outside');
    }

    const higlight = this.isDayHighlighted(day, this);

    if (higlight) {
      classes.push(higlight);
    }

    const handlers = {};
    Object.keys(this.dayEventHandlers || {}).forEach(k => {
      handlers[k] = ev => this.dayEventHandlers[k](day, ev);
    });
    return _objectSpread({
      className: classes.join(' '),
      'data-date': cacheKey(day),
      style: {
        order: position
      }
    }, handlers);
  }

  propsForAllDayEventContainer() {
    const style = this.multiDayCount ? {
      flexBasis: this.multiDayCount * _constants.default.eventHeight
    } : {
      display: 'none'
    };
    return {
      className: 'all-day',
      style
    };
  }

  hourRange() {
    const range = [7, 19];
    Array.from(this.range.by('days')).forEach(day => {
      this.forDay(day).forEach(duration => {
        range[0] = Math.min(duration.event.start.hour(), range[0]);
        range[1] = Math.max(duration.event.end.hour(), range[1]);
      });
    });
    range[1] += 1;
    return range;
  }

  getEventsForWeek(start) {
    const day = start.clone();
    const weeklyEvents = [];

    for (let i = 0; i < 7; i++) {
      const durations = this.forDay(day);

      for (let li = 0, length = durations.length; li < length; li += 1) {
        weeklyEvents.push(durations[li]);
      }

      day.add(1, 'day');
    }

    const minLong = range => _momentRange.default.max(start, range.start).diff(_momentRange.default.min(day, range.end), 'minutes');

    return weeklyEvents.sort((al, bl) => {
      const a = minLong(al.event.range());
      const b = minLong(bl.event.range());
      return a === b ? 0 : a > b ? 1 : -1; // eslint-disable-line no-nested-ternary
    });
  }

  calculateStacking() {
    console.log('STACKING');
    const firstOfWeek = this.range.start.clone().startOf('week');

    do {
      const weeklyEvents = this.getEventsForWeek(firstOfWeek);

      for (let durationIndex = 0; durationIndex < weeklyEvents.length; durationIndex++) {
        const duration = weeklyEvents[durationIndex];

        for (let i = 0; i < durationIndex; i++) {
          const prevDuration = weeklyEvents[i];

          if (duration.range.overlaps(prevDuration.range)) {
            duration.stack += 1;
          }
        }
      }

      firstOfWeek.add(7, 'day');

      for (let durationIndex = 0; durationIndex < weeklyEvents.length; durationIndex++) {
        const duration = weeklyEvents[durationIndex];
        let maxStack = -1;

        for (let i = 0; i < durationIndex; i++) {
          const prevDuration = weeklyEvents[i];

          if (duration.range.overlaps(prevDuration.range)) {
            maxStack = Math.max(duration.maxStack, prevDuration.maxStack, duration.stack + 1, prevDuration.stack + 1);
          }
        }

        duration.maxStack = maxStack;

        for (let i = 0; i < durationIndex; i++) {
          const prevDuration = weeklyEvents[i];

          if (duration.range.overlaps(prevDuration.range)) {
            prevDuration.maxStack = maxStack;
          }
        }
      }
    } while (!firstOfWeek.isAfter(this.range.end));
  } // This is the default implementation.
  // It will be overwritten if highlightDays option is provided


  isDayHighlighted() {
    return false;
  }

  isDateOutsideRange(date) {
    return this.isDisplayingAsMonth && !this.date.isSame(date, 'month');
  }

  forDay(day) {
    return this.cache[cacheKey(day)] || [];
  } // a single day is easy, just add the event to that day


  addtoDaysCache(event) {
    const duration = new _duration.default(this, event, this.range);
    this.addToCache(this.range.start, duration);
  } // other durations must break at week boundaries, with indicators if they were/are continuing


  calculateDurations(event) {
    const end = _momentRange.default.min(this.range.end, event.range().end);

    const start = _momentRange.default.max(this.range.start, event.range().start).clone();

    do {
      const range = _momentRange.default.range(start, start.clone().endOf('week'));

      const duration = new _duration.default(this, event, range);
      this.addToCache(start, duration); // go to first day of next week

      start.add(7 - start.weekday(), 'day');
    } while (!start.isAfter(end));
  }

  addToCache(date, duration) {
    let found = false;

    for (const key in this.cache) {
      // eslint-disable-line no-restricted-syntax
      if (this.cache[key].event === duration.event) {
        found = true;
        break;
      }
    }

    if (!found) {
      duration.first = true; // eslint-disable-line no-param-reassign
    }

    const dayCache = this.cache[cacheKey(date)] || (this.cache[cacheKey(date)] = []);
    dayCache.push(duration);
  }

  displayingAs() {
    return this.display;
  }

  get isDisplayingAsMonth() {
    return 'month' === this.display;
  }

}

exports.default = Layout;