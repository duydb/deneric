import helper from './helper'
import {
    DATA_TYPES
} from './constants'
export class Deneric {
    static String = DATA_TYPES.String
    static Number = DATA_TYPES.Number
    static Boolean = DATA_TYPES.Boolean
    static Object = DATA_TYPES.Object
    static Array = DATA_TYPES.Array
    static Any = DATA_TYPES.Any

    constructor(data = {}, mappings = {}) {
        helper.build_mapping(mappings, this)
        helper.parse_data(data, this)
    }
    get serialize() {
        return helper.serialize(this)
    }
    get deserialize() {
        return helper.deserialize(this)
    }
}

export default Deneric