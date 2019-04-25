import deneric, { DEFAULT_VALUE } from '../source/index'
import assert from 'assert'
import mocha from 'mocha'
// const assert from 'assert'

const describe = mocha.describe

class BooleanEntity extends deneric.Entity {
    constructor(data) {
        super(data, {
            visible: ['visible', deneric.Boolean, true]
        })
    }
}

class ObjectEntity extends deneric.Entity {
    constructor(data) {
        super(data, {
            field: ['field', deneric.Object],
            field2: ['field2', deneric.Object, { name: 'deneric' }],
            field3: ['field3', deneric.Any],
            any2: ['any2', deneric.Any, 'ANY'],
            field4: ['field4', deneric.Array],
            field5: ['field4', deneric.Array, [1, 2, 3]]
        })
    }
}

describe('Default Value - Unit Test', () => {
    describe('Boolean', () => {
        it('Boolean default data = TRUE', () => {
            let tmp1 = new BooleanEntity({
                visible: true
            })
            let tmp2 = new BooleanEntity()
            let tmp3 = new BooleanEntity({
                visible: false
            })
            assert.equal(tmp1.visible, true)
            assert.equal(tmp2.visible, true)
            assert.equal(tmp3.visible, false)
        })
    })
    describe('', () => {
        let tmp1 = new ObjectEntity()
        it('Object TYPE default data must be Empty Object', () => {
            assert.deepStrictEqual(tmp1.field, {})
        })
        it('Object TYPE default data must be equal to default value', () => {
            assert.deepStrictEqual(tmp1.field2, { name: 'deneric' })
        })
        it('ANY TYPE default data must be undefiend', () => {
            assert.deepStrictEqual(tmp1.field3, undefined)
        })

        it('ANY TYPE default data must not be equal defined Value', () => {
            assert.notEqual(tmp1.any2, 'ANY')
        })

        it('ARRAY TYPE default data must be empty Array', () => {
            assert.deepStrictEqual(tmp1.field4, [])
        })

        it('ARRAY TYPE default data must be equal to Default value', () => {
            assert.deepStrictEqual(tmp1.field5, [1, 2, 3])
        })
    })

    // describe('Any', () => {
    //     it('Any default data must be Empty Object', () => {
    //         let tmp1 = new ObjectEntity()
    //         assert.deepStrictEqual(tmp1.field, {})
    //         assert.deepStrictEqual(tmp1.field2, { name: 'deneric' })
    //     })
    // })
})