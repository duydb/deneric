import _ from 'lodash'

const _instance = {
    String: 'String',
    Number: 'Number',
    Boolean: 'Boolean',
    Object: 'Object',
    Array: 'Array',
    Any: 'Any',
    DefaultValue: {
        String: '',
        Number: 0,
        Boolean: false,
        Object: {},
        Array: []
    },
    dataValid(value, dataType) {
        let flag = false
        switch (dataType) {
            case this.String:
                flag = _.isString(value)
                break
            case this.Number:
                if (_.isString(value)) {
                    let tmp = parseFloat(value)
                    flag = !_.isNaN(tmp) && _.isFinite(tmp)
                }
                flag = flag || _.isNumber(value)
                break
            case this.Boolean:
                flag = _.isBoolean(value)
                break
            case this.Object:
                flag = _.isObject(value)
                break
            case this.Array:
                flag = _.isArray(value)
                break
            case this.Any:
                flag = true
        }
        return flag
    },
    parseValue(value, dataType) {
        let res
        switch (dataType) {
            case this.String:
                res = _.isString(value) ? value : this.DefaultValue.String
                break
            case this.Number:
                if (_.isString(value)) {
                    value = parseFloat(value)
                    if (_.isNaN(value) || !_.isFinite(value)) {
                        value = this.DefaultValue.Number
                    }
                }
                res = _.isNumber(value) ? value : this.DefaultValue.Number
                break
            case this.Boolean:
                res = _.isBoolean(value) ? value : this.DefaultValue.Boolean
                break
            case this.Object:
                res = _.isObject(value) ? value : this.DefaultValue.Object
                break
            case this.Array:
                res = _.isArray(value) ? value : this.DefaultValue.Array
                break
            case this.Any:
                res = value
        }
        return res
    },
    selectValue(object, key, dataType) {
        object = _.isObject(object) ? object : {}
        dataType = dataType || this.String
        key = _.isString(key) ? key : ''
        let stackKeys = key.split('.').reverse()
        let tmpObj = object
        while (stackKeys.length) {
            tmpObj = tmpObj[stackKeys.pop()] || {}
        }
        return this.parseValue(tmpObj, dataType)
    },
    setValue(object, key, dataType, value) {
        object = _.isObject(object) ? object : {}
        dataType = dataType || this.String
        key = _.isString(key) ? key : ''
        let stackKeys = key.split('.').reverse()
        let tmpObj = object
        while (stackKeys.length > 1) {
            let key = stackKeys.pop()
            tmpObj[key] = tmpObj[key] || {}
            tmpObj = tmpObj[key]
        }
        if (stackKeys[0]) {
            tmpObj[stackKeys[0]] = this.dataValid(value, dataType) ? value : this.DefaultValue[dataType]
        }
        return object
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
            let item = _.isArray(this._mapping[k]) ? this._mapping[k] : []
            this[k] = _instance.selectValue(data, item[0], item[1])
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
            let item = _.isArray(this._mapping[k]) ? this._mapping[k] : []
            _instance.setValue(res, item[0], item[1], this[k])
        }
        return res
    }
}

export const generic = {
    ..._instance,
    Entity
}

export default generic
