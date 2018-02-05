import generic from '../src/index.js'
import assert from 'assert'

class BeautifulEntity extends generic.Entity {
    constructor(data) {
        super(data, {
            username: ['name', generic.String],
            password: ['pass', generic.String],
            displayName: ['profile.display_name', generic.String],
            age: ['profile.age_int', generic.Number],
            active: ['status_desc.is_active', generic.Boolean]
        })
    }
}
describe('MISC Generic', () => {
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
        })
        it('Missing data', () => {
            let tmp = new BeautifulEntity({
                ...data,
                name: ''
            })
            assert.equal(tmp.username, generic.DefaultValue.String)
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
            assert.equal(tmp.password, generic.DefaultValue.String)
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
            assert.equal(tmp.displayName, generic.DefaultValue.String)
            assert.equal(tmp.age, generic.DefaultValue.Number)
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
                profile: {
                    age_int: '14'
                }
            })
            assert.equal(tmp.username, data.name)
            assert.equal(tmp.password, data.pass)
            assert.equal(tmp.displayName, generic.DefaultValue.String)
            assert.equal(tmp.age, 14)
            assert.equal(tmp.active, data.status_desc.is_active)
            assert.deepStrictEqual(tmp.serialize, {
                ...serialize,
                profile: {
                    display_name: '',
                    age_int: 14
                }
            })
        })
        it('Wrong data type', () => {
            let tmp = new BeautifulEntity({
                ...data,
                name: 1
            })
            assert.equal(tmp.username, generic.DefaultValue.String)
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
            assert.equal(tmp.password, generic.DefaultValue.String)
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
            assert.equal(tmp.displayName, generic.DefaultValue.String)
            assert.equal(tmp.age, generic.DefaultValue.Number)
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
            assert.equal(tmp.active, generic.DefaultValue.Boolean)
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
            }
        }

        function checkInitAndSerialize(dataInit) {
            let tmp = new BeautifulEntity(dataInit)
            assert.equal(tmp.username, generic.DefaultValue.String)
            assert.equal(tmp.password, generic.DefaultValue.String)
            assert.equal(tmp.displayName, generic.DefaultValue.String)
            assert.equal(tmp.age, generic.DefaultValue.Number)
            assert.equal(tmp.active, generic.DefaultValue.Boolean)
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
                'username': 'test'
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
