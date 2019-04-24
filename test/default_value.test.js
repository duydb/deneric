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
})