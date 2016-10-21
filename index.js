'use strict';

const _http = require('./util/_http');
const qs = require('querystring');

/**
 *  Gfycat API wrapper
 */
class Gfycat {
  constructor(clientId, clientSecret) {
    this.apiUrl = 'api.gfycat.com';
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.promiseSupport = typeof Promise !== 'undefined';
    this.token = '';
  }

  /**
   *  Authenticate
   */
  authenticate(callback) {
    var postData = {
      grant_type : 'client_credentials',
      client_id : this.clientId,
      client_secret : this.clientSecret
    };
    
    var options = {
      hostname: this.apiUrl,
      path: '/v1/oauth/token',
      method: 'POST',
      postData: postData
    };

    return this._request(options, callback);
  }

  
  /**
   *  Search
   */
  search(keyword, count = 1, random = false, callback) {
    var queryParams = {
      search_text: keyword,
      count: count,
      random: random
    };

    var options = {
      hostname: this.apiUrl,
      path: '/v1/gfycats/search',
      method: 'GET',
      query: queryParams
    };

    return this._request(options, callback);
  }


  /**
   *  Upload
   */
  upload(opts, callback) {
    //TODO: Add validation logic for options object
    
    var options = {
      hostname: this.apiUrl,
      path: '/v1/gfycats',
      method: 'POST',
      postData: opts
    };

    return this._request(options, callback);
  }


  /**
   *  Check upload status
   */
  checkUploadStatus(gfyId, callback) {
    var options = {
      hostname: this.apiUrl,
      path: '/v1/gfycats/fetch/status/' + gfyId,
      method: 'GET'
    };

    return this._request(options, callback);
  }


  /**
   *  Helper function for making http requests
   */
  _request(options, callback) {
    if (!callback && !this.promiseSupport) {
      throw new Error('Promises unsupported. Use callback functions instead.');
    }

    var query = typeof options.query !== 'undefined' ? qs.stringify(options.query) : '';
    var apiPath = query ? options.path + '?' + query : options.path;
    
    var headers = {
      'Accept-Encoding': 'gzip,deflate',
      'Authorization': 'Bearer ' + this.token
    };

    if (options.headers) {
      headers = Object.assign(headers, options.headers);
    }

    var httpOptions = {
      request: {
        hostname: this.apiUrl,
        path: apiPath,
        method: options.method || 'GET',
        headers: headers
      },
      postData: options.postData || '',
      timeout: options.timeout || 300,
      fmt: options.query && options.query.fmt
    };

    /**
     *  If callback function is provided, override promise handlers.
     */
    if (callback) {
      var resolve = function(res) {
        callback(null, res);
      };

      var reject = function(err) {
        callback(err);
      };

      _http.request(httpOptions, resolve, reject); 
    }
    
    /**
     *  If no callback function is provided and promises are supported, use them.
     */
    else {
      return new Promise( (resolve, reject) => {
        _http.request(httpOptions, resolve, reject);
      });
    }
  }

}

module.exports = Gfycat;

