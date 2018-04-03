const _ = require('lodash')

const DATA_TYPE = {
    String: 'String',
    Number: 'Number',
    Boolean: 'Boolean',
    Object: 'Object',
    Array: 'Array',
    Any: 'Any',
}
const DEFAULT_VALUE = {
    default: undefined,
    [DATA_TYPE.String]: '',
    [DATA_TYPE.Number]: 0,
    [DATA_TYPE.Boolean]: false,
    [DATA_TYPE.Object]: {},
    [DATA_TYPE.Array]: [],
    [DATA_TYPE.Any]: undefined,
}

const PARSER = {
    default: value => value,
    [DATA_TYPE.String]: value => value,
    [DATA_TYPE.Number]: value => value,
    [DATA_TYPE.Boolean]: value => value,
    [DATA_TYPE.Object]: value => value,
    [DATA_TYPE.Array]: value => value,
    [DATA_TYPE.Any]: value => value
}

const VALIDATE = {
    default: () => false,
    [DATA_TYPE.String]: _.isString,
    [DATA_TYPE.Number]: _.isNumber,
    [DATA_TYPE.Boolean]: _.isBoolean,
    [DATA_TYPE.Object]: _.isObject,
    [DATA_TYPE.Array]: _.isArray,
    [DATA_TYPE.Any]: () => true
}

const _instance = Object.assign(DATA_TYPE, {
    ...DATA_TYPE,
    DefaultValue: DEFAULT_VALUE,
    Parser: PARSER,
    Validate: VALIDATE,
    parseValue(value, dataType, defaultValue, parser, validate) {
        let res
        if (_.isFunction(dataType)) {
            res = new dataType(value)
        } else {
            defaultValue = defaultValue || (!_.isUndefined(DEFAULT_VALUE[dataType]) ? DEFAULT_VALUE[dataType] : DEFAULT_VALUE.default)
            parser = parser || (!_.isUndefined(PARSER[dataType]) ? PARSER[dataType] : PARSER.default)
            validate = validate || (!_.isUndefined(VALIDATE[dataType]) ? VALIDATE[dataType] : VALIDATE.default)
            res = validate(value) ? parser(value) : defaultValue
        }
        return res
    },
    selectValue(object, address, dataType, defaultValue, parser, validate) {
        object = _.isObject(object) ? object : {}
        dataType = dataType || this.String
        address = _.isString(address) ? address : ''
        let stackKeys = address.split('.').reverse()
        let tmpObj = object
        while (stackKeys.length) {
            tmpObj = tmpObj[stackKeys.pop()] || {}
        }
        return this.parseValue(tmpObj, dataType, defaultValue, parser, validate)
    },
    setValue(object, address, dataType, value, defaultValue, validate) {
        object = _.isObject(object) ? object : {}
        dataType = dataType || DATA_TYPE.any
        address = _.isString(address) ? address : ''
        let stackKeys = address.split('.').reverse()
        let tmpObj = object
        while (stackKeys.length > 1) {
            let key = stackKeys.pop()
            tmpObj[key] = tmpObj[key] || {}
            tmpObj = tmpObj[key]
        }
        if (stackKeys[0]) {
            if (_.isFunction(dataType) && value instanceof Entity) {
                tmpObj[stackKeys[0]] = value.serialize
            } else {
                defaultValue = defaultValue || (!_.isUndefined(DEFAULT_VALUE[dataType]) ? DEFAULT_VALUE[dataType] : DEFAULT_VALUE.default)
                validate = validate || (!_.isUndefined(VALIDATE[dataType]) ? VALIDATE[dataType] : VALIDATE.default)
                tmpObj[stackKeys[0]] = validate(value) ? value : defaultValue
            }
        }
        return object
    }
})

class Entity {
    constructor(data, mapping) {
        this._parsingData(data, mapping)
    }
    _parsingData(data, mapping) {
        data = _.isObject(data) ? data : {}
        this._mapping = mapping || this.__mapping
        for (let k in this._mapping) {
            let [address, dataType, defaultValue, parser, validate] = _.isArray(this._mapping[k]) ? this._mapping[k] : []
            this[k] = _instance.selectValue(data, address, dataType, defaultValue, parser, validate)
        }
    }
    set _mapping(value) {
        this.__mapping = _.isObject(value) ? value : {}
    }
    get _mapping() {
        return _.isObject(this.__mapping) ? this.__mapping : {}
    }
    get serialize() {
        let res = {}
        for (let k in this._mapping) {
            let [address, dataType, defaultValue, parser, validate] = _.isArray(this._mapping[k]) ? this._mapping[k] : []
            let item = _.isArray(this._mapping[k]) ? this._mapping[k] : []
            _instance.setValue(res, address, dataType, this[k], defaultValue, validate)
        }
        return res
    }
}

module.exports = Object.assign({
    Entity
}, _instance)