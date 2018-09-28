import _ from 'lodash'

export const DATA_TYPES = {
    String: String,
    Number: Number,
    Boolean: Boolean,
    Object: Object,
    Array: Array,
    Any: undefined
}

export const DATA_DEFAULT = {
    [DATA_TYPES.String]: '',
    [DATA_TYPES.Number]: 0,
    [DATA_TYPES.Boolean]: false,
    [DATA_TYPES.Object]: {},
    [DATA_TYPES.Array]: [],
    [DATA_TYPES.Any]: undefined
}

export const VALIDATE = {
    [DATA_TYPES.String]: _.isString,
    [DATA_TYPES.Number]: _.isNumber,
    [DATA_TYPES.Boolean]: _.isBoolean,
    [DATA_TYPES.Object]: _.isObject,
    [DATA_TYPES.Array]: _.isArray,
    [DATA_TYPES.Any]: () => true
}
