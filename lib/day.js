"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _event = _interopRequireDefault(require("./event"));

var _layout = _interopRequireDefault(require("./api/layout"));

var _label = _interopRequireDefault(require("./label"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const IsDayClass = new RegExp('(\\s|^)(events|day|label)(\\s|$)');

class Day extends _react.default.Component {
  constructor() {
    super();
    this.state = {
      resize: false
    };
    ['onClick', 'onDoubleClick', 'onMouseMove', 'onMouseUp', 'onDragStart'].forEach(ev => {
      this[ev] = this[ev].bind(this);
    });
  }

  get boundingBox() {
    return _reactDom.default.findDOMNode(this.refs.events || this.refs.root).getBoundingClientRect();
  }

  onClickHandler(ev, handler) {
    if (!handler || !IsDayClass.test(ev.target.className) || this.lastMouseUp && this.lastMouseUp < new Date().getMilliseconds() + 100) {
      return;
    }

    this.lastMouseUp = 0;
    const bounds = this.boundingBox;
    const perc = Math.max(0.0, (ev.clientY - bounds.top) / ev.target.offsetHeight);
    const hours = this.props.layout.displayHours[0] + this.props.layout.minutesInDay() * perc / 60;
    handler.call(this, ev, this.props.day.clone().startOf('day').add(hours, 'hour'));
  }

  onClick(ev) {
    this.onClickHandler(ev, this.props.handlers.onClick);
  }

  onDoubleClick(ev) {
    this.onClickHandler(ev, this.props.handlers.onDoubleClick);
  }

  onDragStart(resize, eventLayout) {
    eventLayout.setIsResizing(true);
    const bounds = this.boundingBox;
    Object.assign(resize, {
      eventLayout,
      height: bounds.height,
      top: bounds.top
    });
    this.setState({
      resize
    });
  }

  onMouseMove(ev) {
    if (!this.state.resize) {
      return;
    }

    const coord = ev.clientY - this.state.resize.top;
    this.state.resize.eventLayout.adjustEventTime(this.state.resize.type, coord, this.state.resize.height);
    this.forceUpdate();
  }

  onMouseUp(ev) {
    if (!this.state.resize) {
      return;
    }

    this.state.resize.eventLayout.setIsResizing(false);
    setTimeout(() => this.setState({
      resize: false
    }), 1);

    if (this.props.onEventResize) {
      this.props.onEventResize(ev, this.state.resize.eventLayout.event);
    }

    this.lastMouseUp = new Date().getMilliseconds();
  }

  renderEvents() {
    const asMonth = this.props.layout.isDisplayingAsMonth;
    const singleDayEvents = [];
    const allDayEvents = [];
    const onMouseMove = asMonth ? null : this.onMouseMove;
    this.props.layout.forDay(this.props.day).forEach(duration => {
      const event = _react.default.createElement(_event.default, {
        duration: duration,
        key: duration.key(),
        day: this.props.day,
        parent: this,
        onDragStart: this.onDragStart,
        onClick: this.props.onEventClick,
        editComponent: this.props.editComponent,
        onDoubleClick: this.props.onEventDoubleClick
      });

      (duration.event.isSingleDay() ? singleDayEvents : allDayEvents).push(event);
    });
    const events = [];

    if (allDayEvents.length || !asMonth) {
      events.push(_react.default.createElement("div", _extends({
        key: "allday"
      }, this.props.layout.propsForAllDayEventContainer()), allDayEvents));
    }

    if (singleDayEvents.length) {
      events.push(_react.default.createElement("div", {
        key: "events",
        ref: "events",
        className: "events",
        onMouseMove: onMouseMove,
        onMouseUp: this.onMouseUp
      }, singleDayEvents));
    }

    return events;
  }

  render() {
    const props = this.props.layout.propsForDayContainer(this.props);
    return _react.default.createElement("div", _extends({
      ref: "root"
    }, props, {
      onClick: this.onClick,
      onDoubleClick: this.onDoubleClick
    }), _react.default.createElement(_label.default, {
      day: this.props.day,
      className: "label"
    }, this.props.day.format('D')), this.renderEvents());
  }

}

exports.default = Day;
Day.propTypes = {
  day: _propTypes.default.object.isRequired,
  layout: _propTypes.default.instanceOf(_layout.default).isRequired,
  handlers: _propTypes.default.object,
  position: _propTypes.default.number.isRequired,
  highlight: _propTypes.default.func,
  onEventClick: _propTypes.default.func,
  onEventResize: _propTypes.default.func,
  editComponent: _propTypes.default.func,
  onEventDoubleClick: _propTypes.default.func
};
Day.defaultProps = {
  handlers: {}
};