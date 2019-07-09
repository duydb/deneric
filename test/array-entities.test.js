import deneric from '../source/index'
import assert from 'assert'
import mocha from 'mocha'

const data = {
  name: 'array Info',
  items: [
    {
      name: 'A1',
      age: 1
    },
    {
      name: 'A2',
      age: 2
    }
  ],
  tags: ['tag1', 'tag2', 'tag23']
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
      items: ['items', [Info]],
      tags: ['tags', deneric.Array]
    })
  }
}

describe('Array Entities', () => {
  it('Should success when parsing all items of data', () => {
    var a = new ListInfo(data)
    assert.equal(a.items.length, data.items.length)
    console.log('a.serialize', a.serialize)
    assert.deepEqual(a.serialize, data)
  })
  it('Should diff referral when create 2 instance from 1 dataSource', () => {
    var a = new ListInfo(data)
    var b = new ListInfo(data)
    b.tags.push('tag100')

    assert.notDeepEqual(a.tags, b.tags)
  })
})
