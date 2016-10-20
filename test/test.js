'use strict';

const Gfycat = require('../');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('Gfycat JS SDK', () => {
  var gfycat = new Gfycat('2_Uu0k2J', 'Fo-QAvj4ijte_2b_jBNnX_kU-mI_u4K85LEPlrC8P4krc1LtaLTZkczGWq5Nj1Dl');

  describe('Promise based response', () => {

    describe('#authenticate()', () => {
      it('should reject with error', () => {
        return gfycat.search('hello', 1)
          .then(data => {
            expect(data).to.not.exist;
          }, err => {
            expect(err).to.exist;
            expect(err).to.equal('Unauthorized');
          });
      });

      it('should resolve with access token', () => {
        return gfycat.authenticate()
          .then(token => {
            expect(token).to.exist;
            expect(token).to.be.a('string');
          });
      });
    });

    describe('#search()', () => {
      it('should resolve with gfycats', () => {
        return gfycat.search('hello', 1)
          .then(data => {
            expect(data).to.exist;
            expect(data).to.be.an('object');
            expect(data).to.include.keys('gfycats', 'found', 'cursor');
            expect(data.gfycats).to.be.an('array');
            expect(data.found).to.be.a('number');
            expect(data.cursor).to.be.a('string');
          }, err => {
            expect(err).to.not.exist;
          });
      });

      it('should resolve with errorMessage: \'No search results\'', () => {
        return gfycat.search('asdfjk;asdjfkajfahs')
          .then(data => {
            expect(data).to.exist;
            expect(data).to.be.an('object');
            expect(data).to.have.property('errorMessage', 'No search results'); 
          }, err => {
            expect(err).to.not.exist;
          });
      });

      it('should resolve with errorMessage: \'search_text is a required parameter for search\'', () => {
        return gfycat.search('', 1)
          .then(data => {
            expect(data).to.exist;
            expect(data).to.have.key('errorMessage');
          }, err => {
            expect(err).to.not.exist;
          });
      });
    });

    describe('#upload()', () => {
      it('should resolve with data', () => {
        var options = {
          fetchUrl: 'https://scratch.gfycat.com/74EA41A8-1B23-EFA0-D51E-76FF2C250274.mp4',
          captions: [{
            startSeconds: 0,
            duration: 3,
            text: 'HIIII',
            fontHeight: 50
          }]
        };

        return gfycat.upload()
          .then(d => {
            expect(d).to.exist;
          }, err => {
            expect(err).to.not.exist;
          });
      });
    });
  });
});
