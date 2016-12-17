'use strict';

'use strict';

const plugin = require('../../index');
const chai = require('chai');
const expect = chai.expect;

describe('base', () => {
  describe('base', () => {

    describe('indexes', () => {
      let hinter;
      const index1 = {
        a: 1,
        b: -1,
        c: 1,
      };

      const index2 = {
        b: 1,
        c: 1,
      };

      const index3 = {
        c: 1,
      };

      beforeEach('set model function', () => {
        hinter = plugin.hints(index1, index2, index3);
      });

      it('should return index3', () => {
        let data = {
          c: 111,
        };

        expect(hinter(data)).to.equal(index3);
      });

      it('should return index3', () => {
        let data = {
          c: null,
        };

        expect(hinter(data)).to.equal(index3);
      });

      it('should return index3', () => {
        let data = {
          a: 1,
          c: null,
        };

        expect(hinter(data)).to.equal(index3);
      });

      it('should return index2', () => {
        let data = {
          c: 12,
          b: 111,
        };

        expect(hinter(data)).to.equal(index2);
      });

      it('should return index2', () => {
        let data = {
          c: null,
          b: null,
        };

        expect(hinter(data)).to.equal(index2);
      });

      it('should return index2', () => {
        let data = {
          b: 111,
          c: 12,
          d: 19,
        };

        expect(hinter(data)).to.equal(index2);
      });

      it('should return index1', () => {
        let data = {
          a: 'id',
          b: true,
          c: 12,
        };

        expect(hinter(data)).to.equal(index1);
      });

      it('should return index1', () => {
        let data = {
          a: null,
          b: null,
          c: null,
        };

        expect(hinter(data)).to.equal(index1);
      });

      it('should return index1', () => {
        let data = {
          a: 'id',
          c: 12,
          b: 111,
          d: 19,
        };

        expect(hinter(data)).to.equal(index1);
      });

      it('should return {}', () => {
        let data = {
          d: 19,
        };

        expect(hinter(data)).to.deep.equal({});
      });

      it('should return {}', () => {
        let data = {};

        expect(hinter(data)).to.deep.equal({});
      });
    });

  });
});
