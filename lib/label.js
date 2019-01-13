"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line no-unused-vars
const Label = (_ref) => {
  let day = _ref.day;
  return _react.default.createElement("div", {
    className: "label"
  }, day.format('D'));
};

Label.propTypes = {
  day: _propTypes.default.object.isRequired
};
var _default = Label;
exports.default = _default;