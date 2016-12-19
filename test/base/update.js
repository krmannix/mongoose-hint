'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const plugin = require('../../index');
const chai = require('chai');
const expect = chai.expect;
const PlayerSchema = require('../schemas/Player');
const dbUrl = require('../base').TEST_DB;
const connection = mongoose.createConnection(dbUrl);

describe('base', () => {
  describe('update', () => {
    let Player;
    let playerId;
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

      PlayerSchema.plugin(plugin.update, indexHints);

      Player = connection.model('Player', PlayerSchema);
    });

    beforeEach('create Player', () => {
      const data = {
        username: 'krmannix',
        organization: 'World Wide Players',
        team: 'A Team',
        rank: 13,
        country: 'US',
      };

      return Player.create(data)
        .then(doc => playerId = doc.id);
    });

    afterEach('remove Player', () => {
      return Player.remove({ _id: playerId });
    });

    it('should use the COUNTRY_RANK_INDEX hint', () => {
      let query = Player
        .update({
          country: 'US',
          rank: 13,
        }, {
          username: 'kevinmannix'
        });

      return query
        .then(() => Player.findById(playerId))
        .then(doc => {
          expect(doc.username).to.equal('kevinmannix');
          expect(query.options.hint).to.deep.equal(indexes.COUNTRY_RANK_INDEX);
        });
    });

    it('should use the COUNTRY_RANK_INDEX hint', () => {
      let query = Player
        .update({
          country: 'US',
          rank: 13,
          username: 'krmannix',
        }, {
          username: 'kevinmannix'
        });

      return query
        .then(() => Player.findById(playerId))
        .then(doc => {
          expect(doc.username).to.equal('kevinmannix');
          expect(query.options.hint).to.deep.equal(indexes.COUNTRY_RANK_INDEX);
        });
    });

    it('should use the COUNTRY_RANK_INDEX hint', () => {
      let query = Player
        .update({
          country: 'US',
          rank: 13,
          organization: 'World Wide Players',
          username: 'krmannix',
        }, {
          username: 'kevinmannix'
        });

      return query
        .then(() => Player.findById(playerId))
        .then(doc => {
          expect(doc.username).to.equal('kevinmannix');
          expect(query.options.hint).to.deep.equal(indexes.COUNTRY_RANK_INDEX);
        });
    });

    it('should use the COUNTRY_RANK_INDEX hint', () => {
      let query = Player
        .update({
          country: 'US',
          rank: 13,
          organization: 'World Wide Players',
          username: 'krmannix',
          team: 'A Team',
        }, {
          username: 'kevinmannix'
        });

      return query
        .then(() => Player.findById(playerId))
        .then(doc => {
          expect(doc.username).to.equal('kevinmannix');
          expect(query.options.hint).to.deep.equal(indexes.COUNTRY_RANK_INDEX);
        });
    });

    it('should use the ORG_TEAM_INDEX hint', () => {
      let query = Player
        .update({
          rank: 13,
          organization: 'World Wide Players',
          username: 'krmannix',
          team: 'A Team',
        }, {
          username: 'kevinmannix'
        });

      return query
        .then(() => Player.findById(playerId))
        .then(doc => {
          expect(doc.username).to.equal('kevinmannix');
          expect(query.options.hint).to.deep.equal(indexes.ORG_TEAM_INDEX);
        });
    });

    it('should use the ORG_TEAM_INDEX hint', () => {
      let query = Player
        .update({
          organization: 'World Wide Players',
          team: 'A Team',
        }, {
          username: 'kevinmannix'
        });

      return query
        .then(() => Player.findById(playerId))
        .then(doc => {
          expect(doc.username).to.equal('kevinmannix');
          expect(query.options.hint).to.deep.equal(indexes.ORG_TEAM_INDEX);
        });
    });

    it('should use the ORG_INDEX hint', () => {
      let query = Player
        .update({
          rank: 13,
          organization: 'World Wide Players',
        }, {
          username: 'kevinmannix'
        });

      return query
        .then(() => Player.findById(playerId))
        .then(doc => {
          expect(doc.username).to.equal('kevinmannix');
          expect(query.options.hint).to.deep.equal(indexes.ORG_INDEX);
        });
    });

    it('should use the ORG_INDEX hint', () => {
      let query = Player
        .update({
          organization: 'World Wide Players',
        }, {
          username: 'kevinmannix'
        });

      return query
        .then(() => Player.findById(playerId))
        .then(doc => {
          expect(doc.username).to.equal('kevinmannix');
          expect(query.options.hint).to.deep.equal(indexes.ORG_INDEX);
        });
    });

    it('should respect specified hints', () => {
      let query = Player
        .update({
          organization: 'World Wide Players',
        }, {
          username: 'kevinmannix'
        })
        .hint(indexes.ORG_TEAM_INDEX);

      return query
        .then(() => Player.findById(playerId))
        .then(doc => {
          expect(doc.username).to.equal('kevinmannix');
          expect(query.options.hint).to.deep.equal(indexes.ORG_TEAM_INDEX);
        });
    });

    it('should use no hint', () => {
      let query = Player
        .update({
          rank: 13,
        }, {
          username: 'kevinmannix'
        });

      return query
        .then(() => Player.findById(playerId))
        .then(doc => {
          expect(doc.username).to.equal('kevinmannix');
          expect(query.options.hint).to.be.undefined;
        });
    });
  });
});
