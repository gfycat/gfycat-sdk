'use strict';

const Gfycat = require('../');
const expect = require('chai').expect;
const fs = require('fs');
// const sinon = require('sinon');


describe('Gfycat JS SDK', () => {

  describe('Callback based response', () => {
 
    let gfycat = new Gfycat();

    describe('#authenticate()', () => {

      it('should callback with err', done => {
        let gfycat = new Gfycat('asdf', 'asdf');
        gfycat.authenticate( (err, res) => {
          expect(err).to.exist;
          done();
        });
      });
      
      it('should callback with res and no err', done => {
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

    describe('#checkUsername()', () => {
      it('should be false with \'401 Unauthorized\' (Invalid Token)', done => {
        let noAuth = new Gfycat();
        noAuth.checkUsername({username: 'ricardricard'}, (err, data) => {
          expect(data).to.be.false;
          expect(err).to.not.exist;
          done();
        });
      });

      it('should be true with \'404 not found\' (Username Available)', done => {
        let randomString = Math.random().toString(30).substring(10);
        gfycat.checkUsername({username: randomString}, (err, data) => {
          console.log('check name', data);
          expect(data).to.be.true;
          expect(err).to.not.exist;
          done();
        });
      });

      it('should be false with \'2** No Content\' (Username Unavailable)', done => {
        gfycat.checkUsername({username: 'ricardricard'}, (err, data) => {
          expect(data).to.be.false;
          expect(err).to.not.exist;
          done();
        });
      });

      it('should return an \'Invalid Username\' error', done => {
        gfycat.checkUsername(null, (err, data) => {
          expect(data).to.not.exist;
          expect(err).to.be.instanceof(Error);
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

      it('should resolve with gfycats', done => {
        gfycat.search({
          search_text: 'hello'
        }, (err, data) => {
          expect(data).to.be.an('object');
          expect(data).to.include.keys('gfycats', 'found', 'cursor');
          expect(data.gfycats).to.be.an('array');
          expect(data.found).to.be.a('number');
          expect(data.cursor).to.be.a('string');
          expect(err).to.not.exist;
          done();
        });
      });

      it('should resolve with errorMessage: \'No search results\'', done => {
        let randomString = Math.random().toString(30).substring(10);
        gfycat.search({
          search_text: randomString
        }, (err, data) => {
          expect(data).to.exist;
          expect(data).to.be.an('object');
          expect(data).to.have.property('errorMessage', 'No search results'); 
          expect(err).to.not.exist;
          done();
        });
      });

      it('should resolve with errorMessage: \'search_text is a required parameter for search\'', done => {
        gfycat.search({
          search_text: ''
        }, (err, data) => {
          expect(data).to.not.exist;
          expect(err).to.exist;
          expect(err).to.include.key('errorMessage');
          done();
        });
      });

      it('should resolve with gfycats', done => {
        gfycat.search({
        }, (err, data) => {
          expect(data).to.not.exist;
          expect(err).to.be.instanceof(Error);
          done();
        });
      });

      // Will sometimes fail due to search API updating in real time
      // and because promises are asynchronous
      it('should have paging with search cursor', done => {
        gfycat.search({
          search_text: 'cats'
        }, (err, data) => {
          expect(data.cursor).to.be.a('string');
          gfycat.search({
            cursor: data.cursor,
            search_text: 'cats',
            count:1
          }, (err1, data1) => {
            expect(data1.cursor).to.be.a('string');
            expect(data1.gfycats.length).to.equal(1);
            gfycat.search({
              cursor: data.cursor,
              search_text: 'cats',
              count:2
            }, (err2, data2) => {
              expect(data2.gfycats.length).to.equal(2);
              expect(data1.gfycats[0]).to.deep.equal(data2.gfycats[0]);
              done();
            });
          });
        });
      });
    });

    describe('#getUserDetails()', () => {
      it('should resolve with gif info', done => {
        gfycat.getUserDetails('ricardricard'
        , (err, data) => {
          expect(data).to.be.an('object');
          expect(data).to.include.keys('userid', 'username', 'description', 'profileUrl', 'name', 'views',
            'url', 'createDate', 'profileImageUrl', 'verified', 'followers', 'following');
          expect(err).to.not.exist;
          done();
        });
      });
    });

    describe('#getGifDetails()', () => {
      it('should resolve with gif info', done => {
        gfycat.getGifDetails('BrutalSavageRekt'
        , (err, data) => {
          expect(data).to.be.an('object');
          expect(data).to.include.keys('gfyItem');
          expect(data.gfyItem).to.be.an('object');
          expect(err).to.not.exist;
          done();
        });
      });

      it('should return an \'invalid gfyID\' error', done => {
        gfycat.getGifDetails(null
        , (err, data) => {
          expect(data).to.not.exist;
          expect(err).to.be.instanceof(Error);
          done();
        });
      });
    });

    describe('#userFeed()', () => {
      it('should resolve with user feed', done => {
        gfycat.userFeed('kngroo', (err, data) => {
          expect(data).to.be.an('object');
          expect(data).to.include.keys('gfycats', 'cursor');
          expect(data.gfycats).to.be.an('array');
          expect(err).to.not.exist;
          done();
        });
      });

      it('should return an \'invalid gfyID\' error', done => {
        gfycat.userFeed(null, (err, data) => {
          expect(data).to.not.exist;
          expect(err).to.be.instanceof(Error);
          done();
        });
      });
    });

    describe('#trendingGifs()', () => {
      it('should resolve with gfycats without tagName', done => {
        gfycat.trendingGifs({
        }, (err, data) => {
          expect(data).to.be.an('object');
          expect(data).to.include.keys('tag', 'cursor', 'gfycats', 'digest', 'newGfycats');
          expect(data.gfycats).to.be.an('array');
          expect(data.cursor).to.be.a('string');
          expect(err).to.not.exist;
          done();
        });
      });

      it('should resolve with gfycats with tagName', done => {
        gfycat.trendingGifs({
          tagName:'hello',
          count:1
        }, (err, data) => {
          expect(data).to.be.an('object');
          expect(data).to.include.keys('tag', 'cursor', 'gfycats', 'digest', 'newGfycats');
          expect(data.gfycats).to.be.an('array');
          expect(data.gfycats.length).to.equal(1);
          expect(data.cursor).to.be.a('string');
          expect(err).to.not.exist;
          done();
        });
      });

      it('should have paging with trendingGifs cursor', done => {
        gfycat.trendingGifs({
        }, (err, data) => {
          expect(data.cursor).to.be.a('string');
          gfycat.trendingGifs({
            cursor: data.cursor,
            count:1
          }, (err1, data1) => {
            expect(data1.cursor).to.be.a('string');
            expect(data1.gfycats.length).to.equal(1);
            gfycat.trendingGifs({
              cursor: data.cursor,
              count:2
            }, (err2, data2) => {
              expect(data2.gfycats.length).to.equal(2);
              expect(data1.tag).to.equal(data2.tag);
              expect(data1.gfycats[0]).to.deep.equal(data2.gfycats[0]);
              done();
            });
          });
        });
      });
    });

    describe('#trendingTags()', () => {
      it('should resolve with tags', done => {
        gfycat.trendingTags({
        }, (err, data) => {
          expect(data).to.be.an('array');
          expect(err).to.not.exist;
          done();
        });
      });

      it('should populate with gfycats', done => {
        return gfycat.trendingTags({
          tagCount:1,
          gfyCount:1,
          populated:true
        }, (err, data) => {
          expect(data).to.be.an('object');
          expect(data).to.include.keys('tags', 'cursor');
          expect(data.tags).to.be.an('array');
          expect(data.cursor).to.be.a('string');
          expect(data.tags[0]).to.be.an('object');
          expect(data.tags[0]).to.include.keys('tag', 'cursor', 'gfycats');
          expect(err).to.not.exist;
          done();
        });
      });

      it('should populate with appropriate gfycat and tag counts', done => {
        gfycat.trendingTags({
          tagCount:2,
          gfyCount:3,
          populated:true
        }, (err, data) => {
          expect(data).to.be.an('object');
          expect(data).to.include.keys('tags', 'cursor');
          expect(data.tags).to.be.an('array');
          expect(data.cursor).to.be.a('string');
          expect(data.tags.length).to.equal(2);
          expect(data.tags[0]).to.be.an('object');
          expect(data.tags[0]).to.include.keys('tag', 'cursor', 'gfycats');
          expect(data.tags[0].gfycats.length).to.equal(3);
          expect(err).to.not.exist;
          done();
        });
      });

      it('should have paging with trendingTags cursor', done => {
        gfycat.trendingTags({
          tagCount:2,
          populated:true
        }, (err, data) => {
          expect(data.cursor).to.be.a('string');
          gfycat.trendingTags({
            cursor: data.cursor,
            tagCount:1,
            populated:true
          }, (err1, data1) => {
            expect(data1.cursor).to.be.a('string');
            expect(data1.tags.length).to.equal(1);
            gfycat.trendingTags({
              cursor: data.cursor,
              tagCount:2,
              populated:true
            }, (err2, data2) => {
              expect(data2.tags.length).to.equal(2);
              expect(data1.tags[0]).to.deep.equal(data2.tags[0]);
              done();
            });
          });
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
        return gfycat.authenticate()
          .then(data => {
            expect(data).to.not.exist;
          }, err => {
            expect(err).to.exist;
            // expect(err).to.equal('Unauthorized');
          });
      });

      it('should resolve with access token', () => {
        return gfycat.authenticate()
          .then(data => {
            expect(data).to.exist;
            expect(data).to.be.a('object');
          }, err => {
            expect(err).to.not.exist;
          });
      });
    });

    describe('#checkUsername()', () => {
      it('should be false with \'401 Unauthorized\' (Invalid Token)', () => {
        let noAuth = new Gfycat();
        return noAuth.checkUsername({username: 'ricardricard'})
        .then(data => {
          expect(data).to.be.false;
        }, err => {
          expect(err).to.not.exist;
        });
      });

      it('should be true with \'404 not found\' (Username Available)', () => {
        let randomString = Math.random().toString(30).substring(10);
        return gfycat.checkUsername({username: randomString})
        .then(data => {
          expect(data).to.be.true;
        }, err => {
          expect(err).to.not.exist;
        });
      });

      it('should be false with \'2** No Content\' (Username Unavailable)', () => {
        return gfycat.checkUsername({username: 'ricardricard'})
        .then(data => {
          expect(data).to.be.false;
        }, err => {
          expect(err).to.not.exist;
        });
      });

      it('should return an \'invalid username\' error', () => {
        return gfycat.checkUsername()
          .then(data => {
            expect(data).to.not.exist;
          }, err => {
            expect(err).to.be.instanceof(Error);
          });
      });
    });

    // Did not test creating a user
    // describe('#createUser()', () => {
    //   it('should error with \'401 Unauthorized\' (Invalid Token)', () => {
    //     let noAuth = new Gfycat();
    //     return noAuth.createUser({
    //       username: 'shouldneverwork',
    //       password: 'testpassword123'
    //     })
    //     .then(data => {
    //       expect(data).to.not.exist;
    //     }, err => {
    //       expect(err).to.have.property('errorMessage');
    //       expect(err.errorMessage.code).to.equal('Unauthorized');
    //       expect(err.errorMessage.description).to.equal('Not authorized to access this endpoint');
    //       expect(err.statusCode).to.equal(401);
    //     });
    //   });

    //   it('should return an \'Username Taken\' error', () => {
    //     return gfycat.createUser({
    //       username: 'henrytest',
    //       password: 'testpassword123'
    //     })
    //     .then(data => {
    //       expect(data).to.not.exist;
    //     }, err => {
    //       expect(err).to.be.instanceof(Error);
    //     });
    //   });

    //   it('should return an \'Invalid Username\' error', () => {
    //     return gfycat.createUser({
    //       username: null,
    //       password: 'testpassword123'
    //     })
    //     .then(data => {
    //       expect(data).to.not.exist;
    //     }, err => {
    //       expect(err).to.be.instanceof(Error);
    //     });
    //   });
    // });

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
        let randomString = Math.random().toString(30).substring(10);
        return gfycat.search({search_text: randomString})
          .then(data => {
            expect(data).to.exist;
            expect(data).to.be.an('object');
            expect(data).to.have.property('errorMessage', 'No search results'); 
          }, err => {
            expect(err).to.not.exist;
          });
      });

      it('should resolve with errorMessage:' + 
        '\'search_text is a required parameter for search\'', () => {
        return gfycat.search({search_text: ''})
          .then(data => {
            expect(data).to.not.exist;
          }, err => {
            expect(err).to.exist;
            expect(err).to.include.key('errorMessage');
          });
      });

      // Will not error because Promise.all call both at the same time
      it('should have paging with search cursor', () => {
        return gfycat.search({search_text: 'cats'})
          .then(data => {
            expect(data.cursor).to.be.a('string');
            var a = gfycat.trendingGifs({
              cursor: data.cursor,
              search_text: 'cats',
              count: 1
            });
            var b = gfycat.trendingGifs({
              cursor: data.cursor,
              search_text: 'cats',
              count: 2
            });

            return Promise.all([a,b]).then(function(values) {
              expect(values[0].cursor).to.be.a('string');
              expect(values[0].gfycats.length).to.equal(1);
              expect(values[1].gfycats.length).to.equal(2);
              expect(values[0].gfycats[0]).to.deep.equal(values[1].gfycats[0]);
            });
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
    });

    // Used Before to get a keyname
    describe('#uploadFile()', () => {
      let filename = '';
      var options = {
        'title': 'twitch',
        'fetchUrl': '',
        'noMd5': true
      };
      before('obtain filename', gfycat.upload(options)
        .then(data => {
          filename = data.gfyname;
        }, err => {
          expect(err).to.not.exist;
        });
      });

      it('should resolve with data', () => {
        return gfycat.uploadFile(options)
          .then(data => {
            expect(data).to.exist;

          }, err => {
            expect(err).to.not.exist;
          });
      });
    }); */

    describe('#getUserDetails()', () => {
      it('should resolve with gif info', () => {
        return gfycat.getUserDetails('ricardricard')
          .then(data => {
            expect(data).to.be.an('object');
            expect(data).to.include.keys('userid', 'username', 'description',
              'profileUrl', 'name', 'views', 'url', 'createDate',
              'profileImageUrl', 'verified', 'followers', 'following');
          }, err => {
            expect(err).to.not.exist;
          });
      });

      // it('should throw an invalid userID error', () => {
      //   return gfycat.getUserDetails()
      //     .then(data => {
      //       console.log(data);
      //     }, err => {
      //       expect(err).to.be.instanceof(Error);
      //     });
      // });
    });

    describe('#getGifDetails()', () => {
      it('should resolve with gif info', () => {
        return gfycat.getGifDetails('BrutalSavageRekt')
          .then(data => {
            expect(data).to.be.an('object');
            expect(data).to.include.keys('gfyItem');
            expect(data.gfyItem).to.be.an('object');
          }, err => {
            expect(err).to.not.exist;
          });
      });

      it('should throw an \'invalid gfyID\' error', () => {
        return gfycat.getGifDetails()
          .then(data => {
            expect(data).to.not.exist;
          }, err => {
            expect(err).to.be.instanceof(Error);
          });
      });
    });

    describe('#userFeed()', () => {
      it('should resolve with user feed', () => {
        return gfycat.userFeed('henrytest')
        .then(data => {
          expect(data).to.be.an('object');
          expect(data).to.include.keys('gfycats', 'cursor');
          expect(data.gfycats).to.be.an('array');
        }, err => {
          expect(err).to.not.exist;
        });
      });

      it('should return an \'invalid userID\' error', () => {
        return gfycat.getGifDetails()
          .then(data => {
            expect(data).to.not.exist;
          }, err => {
            expect(err).to.be.instanceof(Error);
          });
      });
    });

    describe('#trendingGifs()', () => {
      it('should resolve with gfycats without tagName', () => {
        return gfycat.trendingGifs()
          .then(data => {
            expect(data).to.be.an('object');
            expect(data).to.include.keys('tag', 'cursor', 'gfycats',
              'digest', 'newGfycats');
            expect(data.gfycats).to.be.an('array');
            expect(data.cursor).to.be.a('string');
          }, err => {
            expect(err).to.not.exist;
          });
      });

      it('should resolve with gfycats with tagName', () => {
        return gfycat.trendingGifs({tagName:'hello', count:1})
          .then(data => {
            expect(data).to.be.an('object');
            expect(data).to.include.keys('tag', 'cursor', 'gfycats', 'digest', 'newGfycats');
            expect(data.gfycats).to.be.an('array');
            expect(data.gfycats.length).to.equal(1);
            expect(data.cursor).to.be.a('string');
          }, err => {
            expect(err).to.not.exist;
          });
      });

      it('should have paging with trendingGifs cursor', () => {
        return gfycat.trendingGifs()
          .then(data => {
            expect(data.cursor).to.be.a('string');
            var a = gfycat.trendingGifs({cursor: data.cursor, count:1});
            var b = gfycat.trendingGifs({cursor: data.cursor, count:2});

            return Promise.all([a,b]).then(function(values) {
              expect(values[0].tag).to.equal(values[1].tag);
              expect(values[0].cursor).to.be.a('string');
              expect(values[0].gfycats.length).to.equal(1);
              expect(values[1].gfycats.length).to.equal(2);
              expect(values[0].gfycats[0]).to.deep.equal(values[1].gfycats[0]);
            });
          });
      });
    });

    describe('#trendingTags()', () => {
      it('should resolve with tags', () => {
        return gfycat.trendingTags()
          .then(data => {
            expect(data).to.be.an('array');
            // expect(data).to.include.keys('gfycats', 'cursor');
          }, err => {
            expect(err).to.not.exist;
          });
      });

      it('should populate with gfycats', () => {
        return gfycat.trendingTags({tagCount: 1, gfyCount: 1, populated: true})
          .then(data => {
            expect(data).to.be.an('object');
            expect(data).to.include.keys('tags', 'cursor');
            expect(data.tags).to.be.an('array');
            expect(data.cursor).to.be.a('string');
            expect(data.tags[0]).to.be.an('object');
            expect(data.tags[0]).to.include.keys('tag', 'cursor', 'gfycats');
          }, err => {
            expect(err).to.not.exist;
          });
      });

      it('should populate with appropriate gfycat and tag counts', () => {
        return gfycat.trendingTags({tagCount: 2, gfyCount: 3, populated: true})
          .then(data => {
            expect(data).to.be.an('object');
            expect(data).to.include.keys('tags', 'cursor');
            expect(data.tags).to.be.an('array');
            expect(data.cursor).to.be.a('string');
            expect(data.tags.length).to.equal(2);
            expect(data.tags[0]).to.be.an('object');
            expect(data.tags[0]).to.include.keys('tag', 'cursor', 'gfycats');
            expect(data.tags[0].gfycats.length).to.equal(3);
          }, err => {
            expect(err).to.not.exist;
          });
      });

      it('should have paging with trendingTags cursor', () => {
        return gfycat.trendingTags({tagCount:2,populated:true})
          .then(data => {
            expect(data.cursor).to.be.a('string');
            var a = gfycat.trendingTags({cursor: data.cursor, tagCount:1, populated:true});
            var b = gfycat.trendingTags({cursor: data.cursor, tagCount:2, populated:true});

            return Promise.all([a,b]).then(function(values) {
              expect(values[0].cursor).to.be.a('string');
              expect(values[0].tags.length).to.equal(1);
              expect(values[1].tags.length).to.equal(2);
              expect(values[0].tags[0]).to.deep.equal(values[1].tags[0]);
            });
          });
      });
    });
  });
});
