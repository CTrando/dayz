"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _duration = _interopRequireDefault(require("./api/duration"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const IsResizeClass = new RegExp('(\\s|^)event(\\s|$)');

class Event extends _react.default.Component {
  constructor(props) {
    super(props);
    ['onClick', 'onDoubleClick', 'onDoubleClick', 'onDragStart'].forEach(ev => {
      this[ev] = this[ev].bind(this);
    });
  }

  onClick(ev) {
    if (!this.props.onClick) {
      return;
    }

    this.props.onClick(ev, this.props.duration.event);
    ev.stopPropagation();
  }

  onDoubleClick(ev) {
    if (!this.props.onDoubleClick) {
      return;
    }

    this.props.onDoubleClick(ev, this.props.duration.event);
    ev.stopPropagation();
  }

  onDragStart(ev) {
    if (!IsResizeClass.test(ev.target.className)) {
      return;
    }

    const bounds = _reactDom.default.findDOMNode(this.refs.element).getBoundingClientRect();

    let resize;

    if (ev.clientY - bounds.top < 10) {
      resize = {
        type: 'start'
      };
    } else if (bounds.bottom - ev.clientY < 10) {
      resize = {
        type: 'end'
      };
    } else {
      return;
    }

    this.props.onDragStart(resize, this.props.duration);
  }

  render() {
    const body = _react.default.createElement("div", {
      className: "evbody",
      onClick: this.onClick
    }, this.props.duration.event.render());

    const Edit = this.props.editComponent;
    const children = this.props.duration.isEditing() ? _react.default.createElement(Edit, {
      event: this.props.duration.event
    }, body) : body;
    return _react.default.createElement("div", {
      ref: "element",
      onMouseDown: this.onDragStart,
      style: this.props.duration.inlineStyles(),
      className: this.props.duration.classNames()
    }, children);
  }

}

exports.default = Event;
Event.propTypes = {
  duration: _propTypes.default.instanceOf(_duration.default),
  editComponent: _propTypes.default.func,
  onClick: _propTypes.default.func,
  onDoubleClick: _propTypes.default.func
};