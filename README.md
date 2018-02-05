# deneric
Serialize and deserialize JSON to Entity


### Using Example:

You have JSON Object like
```js
var json = {
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
```

Define Class:
```js
import deneric from 'deneric'

class BeautifulEntity extends deneric.Entity {
    constructor(data) {
        super(data, {
            username: ['name', deneric.String],
            password: ['pass', deneric.String],
            displayName: ['profile.display_name', deneric.String],
            age: ['profile.age_int', deneric.Number],
            active: ['status_desc.is_active', deneric.Boolean]
        })
    }
}

var entity = new BeautifulEntity(json)
```
So you have variable `entity` instance of Class `BeautifulEntity`
Checkout properties of `entity`

```js
{
    __mapping: {
        username: ['name', 'String'],
        password: ['pass', 'String'],
        displayName: ['profile.display_name', 'String'],
        age: ['profile.age_int', 'Number'],
        active: ['status_desc.is_active', 'Boolean']
    },
    username: 'user1',
    password: 'pass2@123',
    displayName: 'User One',
    age: 12,
    active: true
}
```

And have function to get serialize of `entity` (call: `entity.serialize`):

```js
{
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
```

