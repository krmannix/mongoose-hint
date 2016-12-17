'use strict';

const ikat = require('ikat');

class IkatMongooseHintPlugin {

  static hints(...indexes) {
    const patterns = indexes.map(index => [
      indexToPattern(index),
      index,
    ]);

    return ikat.build(...patterns, noMatch());
  }

}

function indexToPattern(index) {
  const opts = {};
  for (let key in index) {
    opts[key] = ikat.notUndefined();
  }
  return opts;
}

function noMatch() {
  return [
    ikat.default(),
    undefined,
  ];
}

module.exports = IkatMongooseHintPlugin;
