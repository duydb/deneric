import deneric from '../source/index';
import assert from 'assert'
import mocha from 'mocha'

const info = {
    name: 'A'
}

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

class Info extends deneric.Entity {
    constructor(data) {
        super(data, {
            name: ['name', deneric.String],
            age: ['age', deneric.Number]
        })
    }
}

class ListInfo extends deneric.Entity {
    constructor(data) {
        super(data, {
            name: ['name', deneric.String],
            items: ['items', [Info]]
        })
    }
}

describe('Array Entities', () => {
    it('Should success when parsing all items of data', () => {

        var a = new ListInfo(data)
        console.log(a.items)
        assert.equal(a.items.length, data.items.length)
    })
})