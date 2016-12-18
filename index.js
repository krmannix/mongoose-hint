'use strict';

'use strict';

const _ = require('lodash');
const hinter = require('./lib');

function find(schema, indexes) {
  hint('find', schema, indexes);
}

function hint(hook, schema, indexes) {

  // create hint selector function
  const findHint = hinter.hints(...indexes);

  // on finds, find the best hint and apply
  schema.pre('find', function() {

    if ((!this.options.hint || _.isEmpty(this.options.hint)) && this._conditions && !_.isEmpty(this._conditions)) {
      const hint = findHint(this._conditions);
      if (hint) this.options.hint = hint;
    }

  });

}

module.exports = {
  find,
};
