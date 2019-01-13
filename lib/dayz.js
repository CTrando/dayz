"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _layout = _interopRequireDefault(require("./api/layout"));

var _day = _interopRequireDefault(require("./day"));

var _xLabels = _interopRequireDefault(require("./x-labels"));

var _yLabels = _interopRequireDefault(require("./y-labels"));

var _eventsCollection = _interopRequireDefault(require("./api/events-collection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Dayz extends _react.default.Component {
  constructor(props) {
    super(props);
    this.layoutFromProps();
  }

  componentDidUpdate(prevProps) {
    // don't calculate layout if update is due to state change
    if (prevProps !== this.props) {
      this.layoutFromProps();
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    this.detachEventBindings();
  }

  detachEventBindings() {
    if (this.props.events) {
      this.props.events.off('change', this.onEventAdd);
    }
  }

  onEventsChange() {
    this.forceUpdate();
  }

  layoutFromProps() {
    const props = this.props;

    if (this.props && props.events) {
      this.detachEventBindings();
      props.events.on('change', this.onEventsChange, this);
    }

    this.layout = new _layout.default(Object.assign({}, props));
  }

  get days() {
    let hello = Array.from(this.layout.range.by('days'));
    hello = hello.slice(1, 6);
    return hello;
  }

  renderDays() {
    return this.days.map((day, index) => _react.default.createElement(_day.default, {
      key: day.format('YYYYMMDD'),
      day: day,
      position: index,
      layout: this.layout,
      editComponent: this.props.editComponent,
      handlers: this.props.dayEventHandlers,
      eventHandlers: this.props.eventHandlers,
      onEventClick: this.props.onEventClick,
      onEventResize: this.props.onEventResize
    }));
  }

  render() {
    const classes = ['dayz', this.props.display];
    return _react.default.createElement("div", {
      className: classes.join(' ')
    }, _react.default.createElement(_xLabels.default, {
      date: this.props.date,
      display: this.props.display
    }), _react.default.createElement("div", {
      className: "body"
    }, _react.default.createElement(_yLabels.default, {
      layout: this.layout,
      display: this.props.display,
      date: this.props.date,
      timeFormat: this.props.timeFormat
    }), _react.default.createElement("div", {
      className: "days"
    }, this.renderDays(), this.props.children)));
  }

}

exports.default = Dayz;
Dayz.EventsCollection = _eventsCollection.default;
Dayz.propTypes = {
  date: _propTypes.default.object.isRequired,
  events: _propTypes.default.instanceOf(_eventsCollection.default),
  display: _propTypes.default.oneOf(['month', 'week', 'day']),
  timeFormat: _propTypes.default.string,
  displayHours: _propTypes.default.array,
  onEventClick: _propTypes.default.func,
  editComponent: _propTypes.default.func,
  onEventResize: _propTypes.default.func,
  dayEventHandlers: _propTypes.default.object,
  highlightDays: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.func])
};
Dayz.defaultProps = {
  display: 'week'
};