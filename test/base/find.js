'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const plugin = require('../../index');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const PlayerSchema = require('../schemas/Player');
const dbUrl = 'mongodb://127.0.0.1/ikat_mongoose_hint_plugin_test_db';
const connection = mongoose.createConnection(dbUrl);

describe('base', () => {
  describe('find', () => {
    let Player;
    const indexes = {
      ORG_INDEX: {
        organization: 1,
      },
      ORG_TEAM_INDEX: {
        organization: 1,
        team: 1,
      },
      COUNTRY_RANK_INDEX: {
        country: 1,
        rank: -1,
      },
    };

    beforeEach('set indexes', () => {
      const indexHints = [
        indexes.COUNTRY_RANK_INDEX,
        indexes.ORG_TEAM_INDEX,
        indexes.ORG_INDEX,
      ];

      PlayerSchema.index(indexes.ORG_INDEX);
      PlayerSchema.index(indexes.ORG_TEAM_INDEX);
      PlayerSchema.index(indexes.COUNTRY_RANK_INDEX);

      PlayerSchema.plugin(plugin.find, indexHints);

      Player = connection.model('Player', PlayerSchema);
    });

    it('should use the COUNTRY_RANK_INDEX hint', () => {
      let query = Player
        .find({
          country: 'EN',
          rank: 2,
        });

      return query
        .then(() => {
          expect(query.options.hint).to.deep.equal(indexes.COUNTRY_RANK_INDEX);
        })
    });

    it('should use the COUNTRY_RANK_INDEX hint', () => {
      let query = Player
        .find({
          country: 'EN',
          rank: 2,
          username: 'Kevin',
        });

      return query
        .then(() => {
          expect(query.options.hint).to.deep.equal(indexes.COUNTRY_RANK_INDEX);
        });
    });

    it('should use the COUNTRY_RANK_INDEX hint', () => {
      let query = Player
        .find({
          country: 'EN',
          rank: 2,
          organization: 'World Wide Gamers',
          username: 'Kevin',
        });

      return query
        .then(() => {
          expect(query.options.hint).to.deep.equal(indexes.COUNTRY_RANK_INDEX);
        });
    });

    it('should use the COUNTRY_RANK_INDEX hint', () => {
      let query = Player
        .find({
          country: 'EN',
          rank: 2,
          organization: 'World Wide Gamers',
          username: 'Kevin',
          team: 'Red Team',
        });

      return query
        .then(() => {
          expect(query.options.hint).to.deep.equal(indexes.COUNTRY_RANK_INDEX);
        });
    });

    it('should use the ORG_TEAM_INDEX hint', () => {
      let query = Player
        .find({
          rank: 2,
          organization: 'World Wide Gamers',
          username: 'Kevin',
          team: 'Red Team',
        });

      return query
        .then(() => {
          expect(query.options.hint).to.deep.equal(indexes.ORG_TEAM_INDEX);
        });
    });

    it('should use the ORG_TEAM_INDEX hint', () => {
      let query = Player
        .find({
          organization: 'World Wide Gamers',
          team: 'Red Team',
        });

      return query
        .then(() => {
          expect(query.options.hint).to.deep.equal(indexes.ORG_TEAM_INDEX);
        });
    });

    it('should use the ORG_INDEX hint', () => {
      let query = Player
        .find({
          rank: 2,
          organization: 'World Wide Gamers',
        });

      return query
        .then(() => {
          expect(query.options.hint).to.deep.equal(indexes.ORG_INDEX);
        });
    });

    it('should use the ORG_INDEX hint', () => {
      let query = Player
        .find({
          organization: 'World Wide Gamers',
        });

      return query
        .then(() => {
          expect(query.options.hint).to.deep.equal(indexes.ORG_INDEX);
        });
    });

    it('should respect specified hints', () => {
      let query = Player
        .find({
          organization: 'World Wide Gamers',
        })
        .hint(indexes.ORG_TEAM_INDEX);

      return query
        .then(() => {
          expect(query.options.hint).to.deep.equal(indexes.ORG_TEAM_INDEX);
        });
    });

    it('should use no hint', () => {
      let query = Player
        .find({
          rank: 2,
        });

      return query
        .then(() => {
          expect(query.options.hint).to.be.undefined;
        });
    });
  });
});
