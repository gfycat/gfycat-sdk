'use strict';

const Gfycat = require('../');
const expect = require('chai').expect;
// const sinon = require('sinon');


describe('Gfycat JS SDK', () => {

  describe('Callback based response', () => {
 
    let gfycat = new Gfycat();

    describe('#authenticate()', () => {

      it('should callback with err', done => {
        let gfycat = new Gfycat('asdf', 'asdf');
        var options = {
          grant_type: 'client_credentials'
        };

        gfycat.authenticate(options, (err, res) => {
          expect(err).to.exist;
          done();
        });
      });
      
      it('should callback with res and no err', (done) => {
        var options = {
          grant_type: 'client_credentials'
        };

        gfycat.authenticate(options, (err, res) => {
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

  describe('Promise based response', () => {

    let gfycat = new Gfycat();

    describe('#authenticate()', () => {
      // it('should reject with Unauthorized error', () => {
      //   return gfycat.search({search_test: 'hello'})
      //     .then(data => {
      //       console.log('data', data);
      //       expect(data).to.not.exist;
      //     }, err => {
      //       console.log('err', err);
      //       expect(err).to.exist;
      //       expect(err).to.equal('Unauthorized');
      //     });
      // });


      it('should reject with error', () => {
        let gfycat = new Gfycat('asdf', 'asdf');
        var options = {
          grant_type: 'client_credentials'
        };

        return gfycat.authenticate(options)
          .then(data => {
            expect(data).to.not.exist;
          }, err => {
            expect(err).to.exist;
            // expect(err).to.equal('Unauthorized');
          });
      });

      it('should resolve with access token', () => {
        var options = {
          grant_type: 'client_credentials'
        };

        return gfycat.authenticate(options)
          .then(data => {
            expect(data).to.exist;
            expect(data).to.be.a('object');
          }, err => {
            expect(err).to.not.exist;
          });
      });
    });

    describe('#search()', () => {
      it('should resolve with gfycats', () => {
        return gfycat.search({search_text: 'hello'})
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
        return gfycat.search({search_text: 'asdfjk;asdjfkajfahs'})
          .then(data => {
            expect(data).to.exist;
            expect(data).to.be.an('object');
            expect(data).to.have.property('errorMessage', 'No search results'); 
          }, err => {
            expect(err).to.not.exist;
          });
      });

      it('should resolve with errorMessage: \'search_text is a required parameter for search\'', () => {
        return gfycat.search({search_text: ''})
          .then(data => {
            expect(data).to.not.exist;
          }, err => {
            expect(err).to.exist;
            expect(err).to.have.key('errorMessage');
          });
      });
    });

    /*describe('#upload()', () => {
      let gfyId = '';
      it('should resolve with data', () => {
        var options = {
          'title': 'twitch',
          'fetchUrl': '',
          'noMd5': true
        };

        return gfycat.upload(options)
          .then(d => {
            expect(d).to.exist;
            gfyId = d.gfyname;
          }, err => {
            expect(err).to.not.exist;
          });
      });

      it('status', () => {
        return gfycat.checkUploadStatus(gfyId.toLowerCase()).then(st => {
          expect(st).to.exist;
        }, err => {
          expect(err).to.not.exist;
        });
      });
    });*/

  });
});
