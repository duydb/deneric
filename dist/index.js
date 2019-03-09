'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DATA_TYPE = exports.VALIDATE = exports.PARSER = exports.DEFAULT_VALUE = exports.Entity = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DEFAULT_VALUE, _PARSER, _VALIDATE, _GET_VALUE;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DATA_TYPE = {
  String: 'String',
  Number: 'Number',
  Boolean: 'Boolean',
  Object: 'Object',
  Array: 'Array',
  Any: 'Any',
  ArrayEntity: 'ArrayEntity',
  MapEntity: 'MapEntity',
  Entity: 'Entity'
};

var DEFAULT_VALUE = (_DEFAULT_VALUE = {
  default: function _default() {
    return undefined;
  }
}, _defineProperty(_DEFAULT_VALUE, DATA_TYPE.String, function () {
  return '';
}), _defineProperty(_DEFAULT_VALUE, DATA_TYPE.Number, function () {
  return 0;
}), _defineProperty(_DEFAULT_VALUE, DATA_TYPE.Boolean, function () {
  return false;
}), _defineProperty(_DEFAULT_VALUE, DATA_TYPE.Object, function () {}), _defineProperty(_DEFAULT_VALUE, DATA_TYPE.Array, function () {
  return [];
}), _defineProperty(_DEFAULT_VALUE, DATA_TYPE.ArrayEntity, function () {
  return [];
}), _defineProperty(_DEFAULT_VALUE, DATA_TYPE.MapEntity, function () {}), _defineProperty(_DEFAULT_VALUE, DATA_TYPE.Entity, function () {}), _defineProperty(_DEFAULT_VALUE, DATA_TYPE.Any, function () {
  return undefined;
}), _DEFAULT_VALUE);

var PARSER = (_PARSER = {
  default: function _default(value) {
    return value;
  }
}, _defineProperty(_PARSER, DATA_TYPE.ArrayEntity, function (value, dataType) {
  var res = [];
  value = _lodash2.default.isArray(value) ? value : [];
  for (var i = 0; i < value.length; i++) {
    if (_lodash2.default.isFunction(dataType[i % dataType.length])) {
      res.push(new dataType[i % dataType.length](value[i]));
    }
  }
  return res;
}), _defineProperty(_PARSER, DATA_TYPE.MapEntity, function (value, dataType) {
  var res = {};
  dataType = _lodash2.default.isObject(dataType) ? dataType : {};
  value = _lodash2.default.isObject(value) ? value : {};
  for (var k in dataType) {
    if (_lodash2.default.isFunction(dataType[k])) {
      res[k] = new dataType[k](value[k]);
    }
  }
  return res;
}), _defineProperty(_PARSER, DATA_TYPE.Entity, function (value, dataType) {
  return new dataType(value);
}), _defineProperty(_PARSER, DATA_TYPE.String, function (value) {
  return value;
}), _defineProperty(_PARSER, DATA_TYPE.Number, function (value) {
  return value;
}), _defineProperty(_PARSER, DATA_TYPE.Boolean, function (value) {
  return value;
}), _defineProperty(_PARSER, DATA_TYPE.Object, function (value) {
  return value;
}), _defineProperty(_PARSER, DATA_TYPE.Array, function (value) {
  return value;
}), _defineProperty(_PARSER, DATA_TYPE.Any, function (value) {
  return value;
}), _PARSER);

var VALIDATE = (_VALIDATE = {
  default: function _default() {
    return false;
  }
}, _defineProperty(_VALIDATE, DATA_TYPE.String, _lodash2.default.isString), _defineProperty(_VALIDATE, DATA_TYPE.Number, _lodash2.default.isNumber), _defineProperty(_VALIDATE, DATA_TYPE.Boolean, _lodash2.default.isBoolean), _defineProperty(_VALIDATE, DATA_TYPE.Object, _lodash2.default.isObject), _defineProperty(_VALIDATE, DATA_TYPE.Array, _lodash2.default.isArray), _defineProperty(_VALIDATE, DATA_TYPE.Entity, function () {
  return true;
}), _defineProperty(_VALIDATE, DATA_TYPE.ArrayEntity, _lodash2.default.isArray), _defineProperty(_VALIDATE, DATA_TYPE.MapEntity, _lodash2.default.isObject), _defineProperty(_VALIDATE, DATA_TYPE.Any, function () {
  return true;
}), _VALIDATE);

var GET_VALUE = (_GET_VALUE = {
  default: function _default(value) {
    return value;
  }
}, _defineProperty(_GET_VALUE, DATA_TYPE.String, function (value) {
  return value;
}), _defineProperty(_GET_VALUE, DATA_TYPE.Number, function (value) {
  return value;
}), _defineProperty(_GET_VALUE, DATA_TYPE.Boolean, function (value) {
  return value;
}), _defineProperty(_GET_VALUE, DATA_TYPE.Object, function (value) {
  return value;
}), _defineProperty(_GET_VALUE, DATA_TYPE.Array, function (value) {
  return value;
}), _defineProperty(_GET_VALUE, DATA_TYPE.Entity, function (value) {
  return value.serialize;
}), _defineProperty(_GET_VALUE, DATA_TYPE.ArrayEntity, function (value) {
  return value.map(function (item) {
    return item.serialize;
  });
}), _defineProperty(_GET_VALUE, DATA_TYPE.MapEntity, function (value) {
  var res = {};
  for (var k in value) {
    res[k] = value[k].serialize;
  }
  return res;
}), _defineProperty(_GET_VALUE, DATA_TYPE.Any, function (value) {
  return value;
}), _GET_VALUE);

var _instance = {
  parseValue: function parseValue(value, dataType, defaultValue, parser, validate) {
    var res = void 0;
    var pureDataType = dataType;
    if (_lodash2.default.isFunction(dataType)) {
      pureDataType = DATA_TYPE.Entity;
    } else if (_lodash2.default.isArray(dataType)) {
      pureDataType = _lodash2.default.isEmpty(dataType) ? DATA_TYPE.Array : DATA_TYPE.ArrayEntity;
    } else if (_lodash2.default.isObject(dataType)) {
      pureDataType = _lodash2.default.isEmpty(dataType) ? DATA_TYPE.Object : DATA_TYPE.MapEntity;
    }
    defaultValue = defaultValue || (!_lodash2.default.isUndefined(DEFAULT_VALUE[pureDataType]()) ? DEFAULT_VALUE[pureDataType]() : DEFAULT_VALUE.default());
    parser = parser || (!_lodash2.default.isUndefined(PARSER[pureDataType]) ? PARSER[pureDataType] : PARSER.default);
    validate = validate || (!_lodash2.default.isUndefined(VALIDATE[pureDataType]) ? VALIDATE[pureDataType] : VALIDATE.default);
    res = validate(value) ? parser(value, dataType) : defaultValue;
    return res;
  },
  selectValue: function selectValue(object, address, dataType, defaultValue, parser, validate) {
    object = _lodash2.default.isObject(object) ? object : {};
    dataType = dataType || this.String;
    address = _lodash2.default.isString(address) ? address : '';
    var stackKeys = address.split('.').reverse();
    var tmpObj = object;
    while (stackKeys.length) {
      tmpObj = tmpObj[stackKeys.pop()] || {};
    }
    return this.parseValue(tmpObj, dataType, defaultValue, parser, validate);
  },
  setValue: function setValue(object, address, dataType, value, defaultValue, validate) {
    object = _lodash2.default.isObject(object) ? object : {};
    dataType = dataType || DATA_TYPE.any;
    address = _lodash2.default.isString(address) ? address : '';
    var stackKeys = address.split('.').reverse();
    var tmpObj = object;
    while (stackKeys.length > 1) {
      var key = stackKeys.pop();
      tmpObj[key] = tmpObj[key] || {};
      tmpObj = tmpObj[key];
    }
    if (stackKeys[0]) {
      tmpObj[stackKeys[0]] = this.getValue(dataType, value, defaultValue, validate);
    }
    return object;
  },
  getPureType: function getPureType(dataType) {
    var pureDataType = dataType;
    if (_lodash2.default.isFunction(dataType)) {
      pureDataType = DATA_TYPE.Entity;
    } else if (_lodash2.default.isArray(dataType)) {
      pureDataType = _lodash2.default.isEmpty(dataType) ? DATA_TYPE.Array : DATA_TYPE.ArrayEntity;
    } else if (_lodash2.default.isObject(dataType)) {
      pureDataType = _lodash2.default.isEmpty(dataType) ? DATA_TYPE.Object : DATA_TYPE.MapEntity;
    }
    return pureDataType;
  },
  getValue: function getValue(dataType, value, defaultValue, validate) {
    var pureDataType = this.getPureType(dataType);
    var getValueFunc = GET_VALUE[pureDataType] || GET_VALUE.default;
    defaultValue = defaultValue || (!_lodash2.default.isUndefined(DEFAULT_VALUE[pureDataType]()) ? DEFAULT_VALUE[pureDataType]() : DEFAULT_VALUE.default());
    validate = validate || (!_lodash2.default.isUndefined(VALIDATE[pureDataType]) ? VALIDATE[pureDataType] : VALIDATE.default);
    return validate(value) ? getValueFunc(value) : defaultValue;
  }
};

var Entity = function () {
  function Entity(data, mapping) {
    _classCallCheck(this, Entity);

    this._parsingData(data, mapping);
  }

  _createClass(Entity, [{
    key: '_parsingData',
    value: function _parsingData(data, mapping) {
      data = _lodash2.default.isObject(data) ? data : {};
      this._mapping = mapping || this.__mapping;
      for (var k in this._mapping) {
        var _ref = _lodash2.default.isArray(this._mapping[k]) ? this._mapping[k] : [],
            _ref2 = _slicedToArray(_ref, 5),
            address = _ref2[0],
            dataType = _ref2[1],
            defaultValue = _ref2[2],
            parser = _ref2[3],
            validate = _ref2[4];

        this[k] = _instance.selectValue(data, address, dataType, defaultValue, parser, validate);
      }
    }
  }, {
    key: '_mapping',
    set: function set(value) {
      this.__mapping = _lodash2.default.isObject(value) ? value : {};
    },
    get: function get() {
      return _lodash2.default.isObject(this.__mapping) ? this.__mapping : {};
    }
  }, {
    key: 'serialize',
    get: function get() {
      var res = {};
      for (var k in this._mapping) {
        var _ref3 = _lodash2.default.isArray(this._mapping[k]) ? this._mapping[k] : [],
            _ref4 = _slicedToArray(_ref3, 5),
            address = _ref4[0],
            dataType = _ref4[1],
            defaultValue = _ref4[2],
            parser = _ref4[3],
            validate = _ref4[4];

        _instance.setValue(res, address, dataType, this[k], defaultValue, validate);
      }
      return res;
    }
  }, {
    key: 'deserialize',
    get: function get() {
      var res = {};
      for (var k in this._mapping) {
        var _ref5 = _lodash2.default.isArray(this._mapping[k]) ? this._mapping[k] : [],
            _ref6 = _slicedToArray(_ref5, 5),
            address = _ref6[0],
            dataType = _ref6[1],
            defaultValue = _ref6[2],
            parser = _ref6[3],
            validate = _ref6[4];

        var item = _lodash2.default.isArray(this._mapping[k]) ? this._mapping[k] : [];
        _instance.setValue(res, k, dataType, this[k], defaultValue, validate);
      }
      return res;
    }
  }]);

  return Entity;
}();

exports.default = {
  String: DATA_TYPE.String,
  Number: DATA_TYPE.Number,
  Boolean: DATA_TYPE.Boolean,
  Object: DATA_TYPE.Object,
  Array: DATA_TYPE.Array,
  Any: DATA_TYPE.Any,
  Entity: Entity,
  selectValue: function selectValue() {
    return _instance.selectValue.apply(_instance, arguments);
  },
  getValue: function getValue() {
    return _instance.getValue.apply(_instance, arguments);
  },
  parseValue: function parseValue() {
    return _instance.parseValue.apply(_instance, arguments);
  }
};
exports.Entity = Entity;
exports.DEFAULT_VALUE = DEFAULT_VALUE;
exports.PARSER = PARSER;
exports.VALIDATE = VALIDATE;
exports.DATA_TYPE = DATA_TYPE;