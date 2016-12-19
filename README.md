mongoose-hint
==============

Generate hints on the fly for every Mongoose query.

[![node](http://img.shields.io/badge/node->=_4.0.0-brightgreen.svg)]()
[![Twitter](https://img.shields.io/badge/twitter-@krodmannix-blue.svg?style=flat)](http://twitter.com/krodmannix)

_Note:_
* Minimum **Node**: v4.0.0
* Minimum **Mongoose**: v4.0

## Example

```javascript
const mongoose = require('mongoose');
const hintPlugin = require('mongoose-hint');

// Mongoose schema
const Employee = mongoose.Schema({
  firstName: String,
  lastName: String,
  badgeNum: Number,
  locationId: String,
  teamId: String,
  type: {
    type: String,
    enum: [
      'ENG',
      'MGMT',
    ],
  },
});

// Indexes for schema
const TEAM_INDEX = {
  teamId: 1,
};

const LOCATION_TEAM_INDEX = {
  locationId: 1,
  teamId: -1,
};

const TEAM_TYPE_INDEX = {
  teamId: 1,
  type: 1,
};

Employee.index(TEAM_INDEX);
Employee.index(LOCATION_TEAM_INDEX);
Employee.index(TEAM_TYPE_INDEX);

// set the plugin with the hints to use, in order of priority
Employee.plugin(hintPlugin.find, [
  LOCATION_TEAM_INDEX,
  TEAM_TYPE_INDEX,
  TEAM_INDEX,
]);

// Queries
Employee.find({
  firstName: 'Kevin',
  teamId: 13,
  type: 'MGMT',
});
// applies TEAM_TYPE_INDEX hint

Employee.find({
  firstName: 'Kevin',
  teamId: 13,
});
// applies TEAM_INDEX hint

Employee.find({
  firstName: 'Kevin',
  teamId: 13,
  type: 'MGMT',
  locationId: '02446',
});
// applies LOCATION_TEAM_INDEX hint

Employee.find({
  firstName: 'Kevin',
  teamId: 13,
  type: 'MGMT',
  locationId: '02446',
}).hint({
  teamId: 1
});
// applies the given hint
```

## Details

Uses [ikat](https://github.com/krmannix/ikat) under the hood for pattern matching. Uses [Mongoose middleware](http://mongoosejs.com/docs/middleware.html) to apply hints to queries if a hint has not already been defined.

Pass in the hints in the array in order of priority - the first hint that matches the query will be used.

Supports `find` queries and `update` queries. `require('mongoose-hint')` exposes both `find` and `update` plugins. You can use either one, or both.

## Tests

Tests can be run via the `npm test` command. [We aim to write tests](test/) for all supported behaviors.

_NOTE_: To run tests, you will need to have a Mongo instance to connect to. By default we use the `ikat_mongoose_hint_plugin_test_db` database locally, but you can pick which database you'd like to run tests against with the `TEST_DB` environment variable like so:

```
TEST_DB=mongodb://127.0.0.1/test_db npm test
```

## Linting

Linting can be run via the `npm run lint` command. All code must pass the [code quality checks](.eslintrc.json) provided by [eslint](http://eslint.org/).

## Contributing

Contributions are always welcome! This may come in the form of _constructive_ criticism via [GitHub issues](https://github.com/krmannix/mongoose-hint/issues), or direct PRs. Contributions will be required to pass all tests and must adhere to the guidelines set forth by the [eslint style guide](.eslintrc.json). This includes source files & test files.

Have suggestions? Add them via a [GitHub issue](https://github.com/krmannix/mongoose-hint/issues)!
