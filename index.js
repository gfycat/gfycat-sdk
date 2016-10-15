'use strict';

// const queryString = require('querystring');
// const httpService = require('./util/http');

// const API_HOST = 'api.gfycat.com';
// const API_BASE_PATH = '/v1/';

// const promiseSupport = typeof Promise !== 'undefined';

// function handleError(err, callback) {
//   if (callback) {
//     return callback(err);
//   } else if (promisesExist) {
//     return Promise.reject(err);
//   } else {
//     thre new Error(err);
//   }
// }

const fs = require('fs');
const https = require('https');
const querystring = require('querystring');
const zlib = require('zlib');
const gzip = zlib.createGunzip();

/**
 *  Gfycat API wrapper
 */
class Gfycat {
  constructor(clientId, clientSecret) {
    this.apiUrl = 'api.gfycat.com';
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.token = '';
  }

  /**
   *  Authenticate
   */
  authenticate() {
    return new Promise( (resolve, reject) => {
      var options = {
        hostname: this.apiUrl,
        path: '/v1/oauth/token',
        method: 'POST',
        headers: {
          'Accept-Encoding': 'gzip,deflate'
        }
      };

      var req = https.request(options, res => {
        res.pipe(gzip);
        let body = [];

        gzip.on('data', d => {
          body.push(d);
        });

        gzip.on('end', () => {
          this.token = JSON.parse(body.join('')).access_token;
          resolve(this.token);
        });
      });

      req.on('error', e => {
        reject();
      });

      var postData = JSON.stringify({
        'grant_type' : 'client_credentials',
        'client_id' : this.clientId,
        'client_secret' : this.clientSecret
      });

      req.write(postData);
      req.end();
    }); 
  }

  
  /**
   *  Search
   */
  search(keyword, count) {
    return new Promise( (resolve, reject) => {
      if (typeof count === 'undefined') count = 1;
      
      var queryParams = querystring.stringify({
        search_text: keyword,
        count: count 
      });

      var options = {
        hostname: this.apiUrl,
        path: '/v1/gfycats/search?' + queryParams,
        method: 'GET',
        headers: {
          'Accept-Encoding': 'gzip,deflate',
          'Authorization': 'Bearer ' + this.token
        }
      };

      var req = https.get(options, res => {
        var output;
        switch (res.headers['content-encoding']) {
          case 'gzip' || 'deflate':
            output = zlib.createUnzip();
            res.pipe(output);
            break;
          default:
            output = res;
            break;
        }

        if (res.statusCode === 401) {
          reject(res.statusMessage);
        }
        
        let body = '';

        output.on('data', d => {
          body += d;
        });

        output.on('end', () => {
          resolve(JSON.parse(body));
        });

        output.on('error', e => {
          reject(e);
        });
      });

      req.on('error', e => {
        reject(e);
      });
    });
  }
}

module.exports = Gfycat;

