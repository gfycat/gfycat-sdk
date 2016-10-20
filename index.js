'use strict';

const fs = require('fs');
const https = require('https');
const querystring = require('querystring');
const zlib = require('zlib');

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
        var gzip = zlib.createGunzip();
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


  /**
   *  Upload
   */
  upload(opts) {
    //TODO: Add validation logic for options object
    return new Promise( (resolve, reject) => {

      var options = {
        hostname: this.apiUrl,
        path: '/v1/gfycats',
        method: 'POST',
        headers: {
          'Accept-Encoding': 'gzip,deflate',
          'Authorization': 'Bearer ' + this.token
        }
      };

      var req = https.request(options, res => {
        var gzip = zlib.createGunzip();
        res.pipe(gzip);
        let body = '';

        gzip.on('data', d => {
          body += d;
        });

        gzip.on('end', () => {
          resolve(JSON.parse(body));
        });

        gzip.on('error', err => {
          reject(err);
        });
      });

      req.on('error', err => {
        reject(err);
      });
      
      var postData = JSON.stringify(opts);

      req.write(postData);
      req.end();
    });
  }


  /**
   *  Check upload status
   */
  checkUploadStatus(gfyId) {
    return new Promise( (resolve, reject) => {
      var options = {
        hostname: this.apiUrl,
        path: '/v1/gfycats/fetch/status/' + gfyId,
        method: 'GET'
      };

      var req = https.get(options, res => {
        let body = '';

        res.on('data', d => {
          body += d;
        });

        res.on('end', () => {
          resolve(JSON.parse(body));
        });

        res.on('error', err => {
          reject(err);
        });
      });

      req.on('error', err => {
        reject(err);
      });
    });
  }


}

module.exports = Gfycat;

