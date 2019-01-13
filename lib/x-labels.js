"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _moment = _interopRequireDefault(require("moment"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class XLabels extends _react.default.Component {
  get days() {
    const days = [];

    if ('day' === this.props.display) {
      days.push((0, _moment.default)(this.props.date));
    } else {
      const day = (0, _moment.default)(this.props.date).startOf('week');

      for (let i = 1; i < 6; i += 1) {
        days.push(day.clone().add(i, 'day'));
      }
    }

    return days;
  }

  render() {
    const format = 'month' === this.props.display ? 'dddd' : 'ddd';
    return _react.default.createElement("div", {
      className: "x-labels"
    }, this.days.map(day => _react.default.createElement("div", {
      key: day.format('YYYYMMDD'),
      className: "day-label"
    }, day.format(format))));
  }

}

exports.default = XLabels;
XLabels.propTypes = {
  display: _propTypes.default.oneOf(['month', 'week', 'day']),
  date: _propTypes.default.object.isRequired
};