import deneric from '../source/index';
import assert from 'assert'
import mocha from 'mocha'
// const assert from 'assert'

const describe = mocha.describe

class ChildEntity extends deneric.Entity {
    constructor(data) {
        super(data, {
            name: ['child_name', deneric.String],
            age: ['profile.age', deneric.Number],
            active: ['profile.is_active', deneric.Boolean]
        })
    }
}

class BeautifulEntity extends deneric.Entity {
    constructor(data) {
        super(data, {
            username: ['name', deneric.String],
            password: ['pass', deneric.String],
            displayName: ['profile.display_name', deneric.String],
            age: ['profile.age_int', deneric.Number],
            active: ['status_desc.is_active', deneric.Boolean],
            child: ['child.info', ChildEntity]
        })
    }
}

describe('Deneric Unit Test', () => {
    describe('valid data init', () => {
        const data = {
            username: 'user123',
            name: 'user1',
            pass: 'pass2@123',
            profile: {
                display_name: 'User One',
                age_int: 12,
                age_double: 12.31
            },
            status_desc: {
                is_active: true,
                is_deactive: false
            },
            child: {
                extras: [1, 2],
                info: {
                    child_name: 'Son 1',
                    profile: {
                        age: 12,
                        is_active: true,
                        is_deactive: false
                    }
                }
            }
        }
        const serialize = {
            name: 'user1',
            pass: 'pass2@123',
            profile: {
                display_name: 'User One',
                age_int: 12
            },
            status_desc: {
                is_active: true
            },
            child: {
                info: {
                    child_name: 'Son 1',
                    profile: {
                        age: 12,
                        is_active: true
                    }
                }
            }
        }

        it('Full data', () => {
            let tmp = new BeautifulEntity(data)
            assert.equal(tmp.username, data.name)
            assert.equal(tmp.password, data.pass)
            assert.equal(tmp.displayName, data.profile.display_name)
            assert.equal(tmp.age, data.profile.age_int)
            assert.equal(tmp.active, data.status_desc.is_active)
            assert.deepStrictEqual(tmp.serialize, serialize)
            assert.deepStrictEqual(tmp.child.serialize, serialize.child.info)
        })
        it('Missing data', () => {
            let tmp = new BeautifulEntity({
                ...data,
                name: undefined
            })
            assert.equal(tmp.username, deneric.DefaultValue[deneric.String])
            assert.equal(tmp.password, data.pass)
            assert.equal(tmp.displayName, data.profile.display_name)
            assert.equal(tmp.age, data.profile.age_int)
            assert.equal(tmp.active, data.status_desc.is_active)
            assert.deepStrictEqual(tmp.serialize, {
                ...serialize,
                name: ''
            })
            tmp = new BeautifulEntity({
                ...data,
                pass: ''
            })
            assert.equal(tmp.username, data.name)
            assert.equal(tmp.password, deneric.DefaultValue[deneric.String])
            assert.equal(tmp.displayName, data.profile.display_name)
            assert.equal(tmp.age, data.profile.age_int)
            assert.equal(tmp.active, data.status_desc.is_active)
            assert.deepStrictEqual(tmp.serialize, {
                ...serialize,
                pass: ''
            })
            tmp = new BeautifulEntity({
                ...data,
                profile: {}
            })
            assert.equal(tmp.username, data.name)
            assert.equal(tmp.password, data.pass)
            assert.equal(tmp.displayName, deneric.DefaultValue[deneric.String])
            assert.equal(tmp.age, deneric.DefaultValue.Number)
            assert.equal(tmp.active, data.status_desc.is_active)
            assert.deepStrictEqual(tmp.serialize, {
                ...serialize,
                profile: {
                    display_name: '',
                    age_int: 0
                }
            })
        })
        it('Wrong data type', () => {
            let tmp = new BeautifulEntity({
                ...data,
                name: 1
            })
            assert.equal(tmp.username, deneric.DefaultValue.String)
            assert.equal(tmp.password, data.pass)
            assert.equal(tmp.displayName, data.profile.display_name)
            assert.equal(tmp.age, data.profile.age_int)
            assert.equal(tmp.active, data.status_desc.is_active)
            assert.deepStrictEqual(tmp.serialize, {
                ...serialize,
                name: ''
            })
            tmp = new BeautifulEntity({
                ...data,
                pass: true
            })
            assert.equal(tmp.username, data.name)
            assert.equal(tmp.password, deneric.DefaultValue.String)
            assert.equal(tmp.displayName, data.profile.display_name)
            assert.equal(tmp.age, data.profile.age_int)
            assert.equal(tmp.active, data.status_desc.is_active)
            assert.deepStrictEqual(tmp.serialize, {
                ...serialize,
                pass: ''
            })
            tmp = new BeautifulEntity({
                ...data,
                profile: [1, 2, 3]
            })
            assert.equal(tmp.username, data.name)
            assert.equal(tmp.password, data.pass)
            assert.equal(tmp.displayName, deneric.DefaultValue.String)
            assert.equal(tmp.age, deneric.DefaultValue.Number)
            assert.equal(tmp.active, data.status_desc.is_active)
            assert.deepStrictEqual(tmp.serialize, {
                ...serialize,
                profile: {
                    display_name: '',
                    age_int: 0
                }
            })
            tmp = new BeautifulEntity({
                ...data,
                status_desc: {
                    is_active: 'true'
                }
            })
            assert.equal(tmp.username, data.name)
            assert.equal(tmp.password, data.pass)
            assert.equal(tmp.displayName, data.profile.display_name)
            assert.equal(tmp.age, data.profile.age_int)
            assert.equal(tmp.active, deneric.DefaultValue.Boolean)
            assert.deepStrictEqual(tmp.serialize, {
                ...serialize,
                status_desc: {
                    is_active: false
                }
            })
        })
    })
    describe('invalid data init', () => {
        const serialize = {
            name: '',
            pass: '',
            profile: {
                display_name: '',
                age_int: 0
            },
            status_desc: {
                is_active: false
            },
            child: {
                info: {
                    child_name: '',
                    profile: {
                        age: 0,
                        is_active: false
                    }
                }
            }
        }

        function checkInitAndSerialize(dataInit) {
            let tmp = new BeautifulEntity(dataInit)
            assert.equal(tmp.username, deneric.DefaultValue.String)
            assert.equal(tmp.password, deneric.DefaultValue.String)
            assert.equal(tmp.displayName, deneric.DefaultValue.String)
            assert.equal(tmp.age, deneric.DefaultValue.Number)
            assert.equal(tmp.active, deneric.DefaultValue.Boolean)
            assert.deepEqual(tmp.serialize, serialize)
        }
        it('Undefined', () => {
            checkInitAndSerialize()
        })
        it('Null', () => {
            checkInitAndSerialize(null)
        })
        it('Array', () => {
            checkInitAndSerialize([1, 2, 3, '4', true])
            checkInitAndSerialize([])
        })
        it('Object', () => {
            checkInitAndSerialize({
                'name': 1,
                'username': 'test',
                child: [1, 2, 3]
            })
            checkInitAndSerialize({})
        })
        it('Boolean', () => {
            checkInitAndSerialize(true)
            checkInitAndSerialize(false)
        })
        it('Number', () => {
            checkInitAndSerialize(0)
            checkInitAndSerialize(1)
            checkInitAndSerialize(-1)
            checkInitAndSerialize(NaN)
            checkInitAndSerialize(1 / 0)
        })
        it('String', () => {
            checkInitAndSerialize('')
            checkInitAndSerialize('12123123')
            checkInitAndSerialize('asd_asdas-asd')
        })
    })
})