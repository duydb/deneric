import _ from 'lodash'

const DATA_TYPE = {
    String: 'String',
    Number: 'Number',
    Boolean: 'Boolean',
    Object: 'Object',
    Array: 'Array',
    Any: 'Any',
    ArrayEntity: 'ArrayEntity',
    MapEntity: 'MapEntity',
    Entity: 'Entity'
}

const DEFAULT_VALUE = {
    default: () => undefined,
    [DATA_TYPE.String]: () => '',
    [DATA_TYPE.Number]: () => 0,
    [DATA_TYPE.Boolean]: () => false,
    [DATA_TYPE.Object]: () => {},
    [DATA_TYPE.Array]: () => [],
    [DATA_TYPE.ArrayEntity]: () => [],
    [DATA_TYPE.MapEntity]: () => {},
    [DATA_TYPE.Entity]: () => {},
    [DATA_TYPE.Any]: () => undefined
}

const PARSER = {
    default: value => value,
    [DATA_TYPE.ArrayEntity](value, dataType) {
        let res = []
        value = _.isArray(value) ? value : []
        for (let i = 0; i < value.length; i++) {
            if (_.isFunction(dataType[i % dataType.length])) {
                res.push(new dataType[i % dataType.length](value[i]))
            }
        }
        return res
    },
    [DATA_TYPE.MapEntity](value, dataType) {
        let res = {}
        dataType = _.isObject(dataType) ? dataType : {}
        value = _.isObject(value) ? value : {}
        for (let k in dataType) {
            if (_.isFunction(dataType[k])) {
                res[k] = new dataType[k](value[k])
            }
        }
        return res
    },
    [DATA_TYPE.Entity](value, dataType) {
        return new dataType(value)
    },
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
    [DATA_TYPE.Entity]: () => true,
    [DATA_TYPE.ArrayEntity]: _.isArray,
    [DATA_TYPE.MapEntity]: _.isObject,
    [DATA_TYPE.Any]: () => true
}

const GET_VALUE = {
    default: value => value,
    [DATA_TYPE.String]: value => value,
    [DATA_TYPE.Number]: value => value,
    [DATA_TYPE.Boolean]: value => value,
    [DATA_TYPE.Object]: value => Object.assign({}, value),
    [DATA_TYPE.Array]: value => [].concat(value),
    [DATA_TYPE.Entity]: value => value.serialize,
    [DATA_TYPE.ArrayEntity]: value => value.map(item => item.serialize),
    [DATA_TYPE.MapEntity]: value => {
        let res = {}
        for (let k in value) {
            res[k] = value[k].serialize
        }
        return res
    },
    [DATA_TYPE.Any]: value => value
}

const _instance = {
    parseValue(value, dataType, defaultValue, parser, validate) {
        let res
        let pureDataType = dataType
        if (_.isFunction(dataType)) {
            pureDataType = DATA_TYPE.Entity
        } else if (_.isArray(dataType)) {
            pureDataType = _.isEmpty(dataType) ? DATA_TYPE.Array : DATA_TYPE.ArrayEntity
        } else if (_.isObject(dataType)) {
            pureDataType = _.isEmpty(dataType) ? DATA_TYPE.Object : DATA_TYPE.MapEntity
        }
        defaultValue = defaultValue || (!_.isUndefined(DEFAULT_VALUE[pureDataType]()) ? DEFAULT_VALUE[pureDataType]() : DEFAULT_VALUE.default())
        parser = parser || (!_.isUndefined(PARSER[pureDataType]) ? PARSER[pureDataType] : PARSER.default)
        validate = validate || (!_.isUndefined(VALIDATE[pureDataType]) ? VALIDATE[pureDataType] : VALIDATE.default)
        res = validate(value) ? parser(value, dataType) : defaultValue
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
            tmpObj[stackKeys[0]] = this.getValue(dataType, value, defaultValue, validate)
        }
        return object
    },
    getPureType(dataType) {
        let pureDataType = dataType
        if (_.isFunction(dataType)) {
            pureDataType = DATA_TYPE.Entity
        } else if (_.isArray(dataType)) {
            pureDataType = _.isEmpty(dataType) ? DATA_TYPE.Array : DATA_TYPE.ArrayEntity
        } else if (_.isObject(dataType)) {
            pureDataType = _.isEmpty(dataType) ? DATA_TYPE.Object : DATA_TYPE.MapEntity
        }
        return pureDataType
    },
    getValue(dataType, value, defaultValue, validate) {
        let pureDataType = this.getPureType(dataType)
        let getValueFunc = GET_VALUE[pureDataType] || GET_VALUE.default
        defaultValue = defaultValue || (!_.isUndefined(DEFAULT_VALUE[pureDataType]()) ? DEFAULT_VALUE[pureDataType]() : DEFAULT_VALUE.default())
        validate = validate || (!_.isUndefined(VALIDATE[pureDataType]) ? VALIDATE[pureDataType] : VALIDATE.default)
        return validate(value) ? getValueFunc(value) : defaultValue
    }
}

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
            _instance.setValue(res, address, dataType, this[k], defaultValue, validate)
        }
        return res
    }
    get deserialize() {
        let res = {}
        for (let k in this._mapping) {
            let [address, dataType, defaultValue, parser, validate] = _.isArray(this._mapping[k]) ? this._mapping[k] : []
            let item = _.isArray(this._mapping[k]) ? this._mapping[k] : []
            _instance.setValue(res, k, dataType, this[k], defaultValue, validate)
        }
        return res
    }
}

export default {
    String: DATA_TYPE.String,
    Number: DATA_TYPE.Number,
    Boolean: DATA_TYPE.Boolean,
    Object: DATA_TYPE.Object,
    Array: DATA_TYPE.Array,
    Any: DATA_TYPE.Any,
    Entity: Entity,
    selectValue: (...args) => _instance.selectValue(...args),
    getValue: (...args) => _instance.getValue(...args),
    parseValue: (...args) => _instance.parseValue(...args)
}

export { Entity, DEFAULT_VALUE, PARSER, VALIDATE, DATA_TYPE }