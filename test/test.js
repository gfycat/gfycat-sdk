'use strict';

const Gfycat = require('../');
const expect = require('chai').expect;
// const sinon = require('sinon');


describe('Gfycat JS SDK', () => {
  var gfycat = new Gfycat('2_Uu0k2J', 'Fo-QAvj4ijte_2b_jBNnX_kU-mI_u4K85LEPlrC8P4krc1LtaLTZkczGWq5Nj1Dl');

  describe('Callback based response', () => {
    
    describe('#authenticate()', () => {
      it('should callback with res and no err', (done) => {
        gfycat.authenticate( (err, res) => {
          expect(err).to.not.exist;
          expect(res).to.exist;
          expect(res).to.contain.keys('token_type', 'scope', 'expires_in', 'access_token');
          expect(res.token_type).to.equal('bearer');
          expect(res.access_token).to.be.a('string');
          done();
        });
      });
    });

    describe('#search()', () => {
      it('should callback with res and no err', done => {
        gfycat.search({
          search_text: 'hello'
        }, (err, data) => {
          expect(err).to.not.exist;
          expect(data).to.exist;
          done();
        });
      });
    });
  });

/*  describe('Promise based response', () => {

    describe('#authenticate()', () => {
      it('should reject with error', () => {
        gfycat.search('hello')
          .then(data => {
            console.log('data', data);
            expect(data).to.not.exist;
          }, err => {
            console.log('err', err);
            expect(err).to.exist;
            expect(err).to.equal('Unauthorized');
          });
      });

      it('should resolve with access token', () => {
        gfycat.authenticate()
          .then(token => {
            console.log('token', token);
            expect(token).to.exist;
            expect(token).to.be.a('string');
          }, err => {
            console.log('err', err);
          });
      });
    });

    describe('#search()', () => {
      it('should resolve with gfycats', () => {
        gfycat.search('hello', 1)
          .then(data => {
            console.log('data', data);
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
        gfycat.search('asdfjk;asdjfkajfahs')
          .then(data => {
            console.log('data', data);
            expect(data).to.exist;
            expect(data).to.be.an('object');
            expect(data).to.have.property('errorMessage', 'No search results'); 
          }, err => {
            expect(err).to.not.exist;
          });
      });

      it('should resolve with errorMessage: \'search_text is a required parameter for search\'', () => {
        gfycat.search('', 1)
          .then(data => {
            console.log('data', data);
            expect(data).to.exist;
            expect(data).to.have.key('errorMessage');
          }, err => {
            expect(err).to.not.exist;
          });
      });
    });

    describe('#upload()', () => {
      let gfyId = '';
      it('should resolve with data', () => {
        var options = {
          'title': 'twitch',
          'fetchUrl': 'https://scratch.gfycat.com/74EA41A8-1B23-EFA0-D51E-76FF2C250274.mp4',
          'noMd5': true
        };

        gfycat.upload(options)
          .then(d => {
            expect(d).to.exist;
            gfyId = d.gfyname;
          }, err => {
            expect(err).to.not.exist;
          });
      });

      it('status', () => {
        gfycat.checkUploadStatus(gfyId.toLowerCase()).then(st => {
          expect(st).to.exist;
        }, err => {
          expect(err).to.not.exist;
        });
      });
    });
  });*/
});
