import _ from 'lodash'

import { DATA_DEFAULT, DATA_TYPES, VALIDATE } from './constants'

const positions = {
  // address/path to value
  address: 0,
  // data type: using when parsing_data/deserialize/serialize
  data_type: 1,
  // default value
  default_value: 2,
  // options force parsing without validate data type (true: is enabled, other value: is disabled)
  force_parsing: 3,
  // function to validate data_type
  validate: 4
}

export default {
  mapping_key: Symbol('_mapping_'),
  build_mapping(mapping = {}, vm) {
    let trueMapping = _.isObject(mapping) ? mapping : {}
    this.set_mapping(trueMapping, vm)
  },
  set_mapping(mapping = {}, vm) {
    vm[this.mapping_key] = mapping
  },
  get_mapping(vm) {
    return vm[this.mapping_key] || {}
  },
  parse_data(data, vm) {
    let mapping = this.get_mapping(vm)
    for (let k in mapping) {
      let mappingField = mapping[k]
      vm[k] = this.get_value(data, mappingField)
    }
  },
  select_pure_value(data, address, forceParsing = false) {
    data = _.isObject(data) ? data : {}
    address = _.isString(address) ? address : ''
    let keys = address.split('.').reverse()
    let temp = data
    while (keys.length > 0) {
      temp = _.isObject(temp) ? temp[keys.pop()] : {}
    }
    return temp
  },
  is_array_entity_type(DataType) {
    let flag = true
    if (_.isArray(DataType)) {
      flag = !DataType.find(item => !_.isFunction(item))
    } else {
      flag = false
    }
    return flag
  },
  select_array_entity_value(value, DataType) {
    let res = []
    if (_.isArray(value)) {
      res = value.map((item, key) => new DataType[key % DataType.length](item))
    } else {
      res = DATA_DEFAULT[DATA_TYPES.Array]
    }
    return res
  },
  get_value(data, mappingField = []) {
    mappingField = _.isArray(mappingField) ? mappingField : []
    // return

    let address = mappingField[positions.address] || ''
    let DataType = mappingField[positions.data_type] || DATA_TYPES.Any
    let defaultValue =
      mappingField.length > positions.default_value ? mappingField[positions.default_value] : DATA_DEFAULT[DataType]
    let validate = _.isFunction(mappingField[positions.validate])
      ? mappingField[positions.validate]
      : VALIDATE[DataType]
    let forceParsing = mappingField[positions.force_parsing] === true

    let value = this.select_pure_value(data, address)

    // update validate & defaultValue if dataType is Array_Entity type
    if (this.is_array_entity_type(DataType)) {
      validate = VALIDATE[DATA_TYPES.Array]
      defaultValue = DATA_DEFAULT[DATA_TYPES.Array]
    }

    if (!forceParsing) {
      value = validate(value) ? value : defaultValue
    }

    if (this.is_array_entity_type(DataType)) {
      value = this.select_array_entity_value(value, DataType)
    } else if (_.isFunction(DataType)) {
      value = new DataType(value)
    }

    return value
  },
  set_value(response, value, mappingField) {
    response = _.isObject(response) ? response : {}
    let address = mappingField[positions.address] || ''
    let keys = address.split('.').reverse()
    let temp = response
    while (keys.length >= 1) {
      let key = keys.pop()
      if (keys.length > 0) {
        if (!temp[key]) {
          temp[key] = {}
        }
        temp = temp[key]
      } else {
        temp[key] = value
      }
    }
    return response
  },
  get_serialize_value(rawValue, mappingField) {
    let value = rawValue
    // let get value to serialize
    return value
  },
  serialize(vm) {
    let res = {}
    let mapping = this.get_mapping(vm)
    for (let k in mapping) {
      let mappingField = mapping[k]
      let value = this.get_serialize_value(vm[k], mappingField)
      this.set_value(res, value, mappingField)
    }
    return res
  },
  deserialize(vm) {
    let res = {}
    let mapping = this.get_mapping(vm)
    for (let k in mapping) {
      res[k] = vm[k]
    }
    return res
  }
}
