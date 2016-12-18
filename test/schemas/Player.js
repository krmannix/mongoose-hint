'use strict';

const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
  username: String,
  organization: String,
  team: String,
  rank: Number,
  country: {
    type: String,
    enum: [
      'US',
      'UK',
      'CA',
    ],
  },
});

module.exports = PlayerSchema;
