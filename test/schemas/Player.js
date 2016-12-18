'use strict';

const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
  username: String,
  organization: String,
  team: String,
  rank: Number,
  country: {
    enum: [
      'US',
      'UK',
      'CA',
    ],
  },
});

module.exports = PlayerSchema;
