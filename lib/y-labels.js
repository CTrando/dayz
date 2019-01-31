"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _momentRange = _interopRequireDefault(require("./moment-range"));

var _layout = _interopRequireDefault(require("./api/layout"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

class YLabels extends _react.default.Component {
  get hours() {
    const _this$props$layout$di = _slicedToArray(this.props.layout.displayHours, 2),
          start = _this$props$layout$di[0],
          end = _this$props$layout$di[1];

    return Array(end - start).fill().map((_, i) => i + start);
  }

  renderLabels() {
    const day = (0, _momentRange.default)();
    return this.hours.map(hour => {
      return _react.default.createElement("div", {
        key: hour,
        className: "hour"
      }, _react.default.createElement("div", {
        key: `${hour} label`,
        className: "hour-label"
      }, day.hour(hour).format(this.props.timeFormat)), _react.default.createElement("div", {
        key: `${hour} body`,
        className: "hour-body"
      }));
    });
  }

  render() {
    if ('month' === this.props.display) {
      return null;
    }

    return _react.default.createElement("div", null, _react.default.createElement("div", {
      className: "y-labels"
    }, _react.default.createElement("div", this.props.layout.propsForAllDayEventContainer(), "All Day"), this.renderLabels()));
  }

}

exports.default = YLabels;
YLabels.propTypes = {
  display: _propTypes.default.oneOf(['month', 'week', 'day']).isRequired,
  date: _propTypes.default.object.isRequired,
  layout: _propTypes.default.instanceOf(_layout.default).isRequired,
  timeFormat: _propTypes.default.string
};
YLabels.defaultProps = {
  timeFormat: 'ha'
};