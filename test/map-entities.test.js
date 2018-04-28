import deneric from '../source/index';
import assert from 'assert'
import mocha from 'mocha'

const info = {
    name: 'A'
}

const data = {
    name: 'array Info',
    data: {
        user1: {
            name: 'A',
            age: 1
        },
        user2: {
            name: 'B',
            company: 'Company A'
        }
    }
}

class Info extends deneric.Entity {
    constructor(data) {
        super(data, {
            name: ['name', deneric.String],
            age: ['age', deneric.Number]
        })
    }
}

class Info2 extends deneric.Entity {
    constructor(data) {
        super(data, {
            name: ['name', deneric.String],
            company: ['company', deneric.String]
        })
    }
}

class MapInfo extends deneric.Entity {
    constructor(data) {
        super(data, {
            name: ['name', deneric.String],
            items: ['data', {
                user1: Info,
                user2: Info2,
            }]
        })
    }
}

describe('Array Entities', () => {
    it('Should success when parsing all items of data', () => {
        var a = new MapInfo(data)
        assert.deepEqual(a.serialize, data)
    })
})