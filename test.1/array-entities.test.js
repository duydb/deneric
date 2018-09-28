import Deneric from '../src/deneric'
import assert from 'assert'
import {
    describe,
    it
} from 'mocha'

const data = {
    name: 'array Info',
    items: [{
            name: 'A',
            age: 1
        },
        {
            name: 'A',
            age: 2
        }
    ]
}

class Info extends Deneric {
    constructor(data) {
        super(data, {
            name: ['name', Deneric.String],
            age: ['age', Deneric.Number]
        })
    }
}

class ListInfo extends Deneric {
    constructor(data) {
        super(data, {
            name: ['name', Deneric.String],
            items: ['items', [Info]]
        })
    }
}

describe('Array Entities', () => {
    it('Should success when parsing all items of data', () => {
        var a = new ListInfo(data)
        assert.equal(a.items.length, data.items.length)
        assert.deepEqual(a.serialize, data)
    })
})
