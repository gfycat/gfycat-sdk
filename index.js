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

    this._request(options, (err, data) => {
      if (err) {
        if (callback) return callback(err);
        else {
          return new Promise( (resolve, reject) => {
            if (err) reject(err);
            else resolve(data);
          });
        }
      } else {
        this.token = data.access_token
        if (callback) return callback(null, data);
        else {
          return new Promise( (resolve, reject) => {
            if (err) reject(err);
            else resolve(data);
          });
        }
      }
      // return new Promise( (resolve, reject) => {
      //   if (err) reject(err);
      //   else resolve(data);
      // });
    });
  }

  
  /**
   *  Search
   */
  search(opts, callback) {
    var queryParams = {
      search_text: opts.search_text,
      count: opts.count || 1
    };

    if (opts.random) queryParams.random = true;
    if (opts.cursor) queryParams.cursor = opts.cursor;

    var options = {
      hostname: this.apiUrl,
      path: '/v1/gfycats/search',
      method: 'GET',
      query: queryParams
    };

    return this._request(options, callback);
  }

  
  /**
   *  Trending
   */
  trendingGifs(tag, count = 1, cursor, callback) {
    var queryParams = {
      count: count
    };

    if (tag) queryParams.tagName = tag;
    if (cursor) queryParams.cursor = cursor;

    var options = {
      hostname: this.apiUrl,
      path: '/v1/gfycats/trending',
      method: 'GET',
      query: queryParams
    };

    return this._request(options, callback);
  }


  /**
   *  Trending tags
   */
  trendingTags(tagCount = 1, gifCount = 1, populated = false, cursor, callback) {
    var queryParams = {
      tagCount: tagCount,
      gfyCount: gifCount
    };

    var path = '/v1/tags/trending';

    if (cursor) queryParams.cursor = cursor;
    if (populated) path += '/populated';

    var options = {
      hostname: this.apiUrl,
      path: path,
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
      'Accept-Encoding': 'gzip,deflate'
    };

    if (this.token) headers['Authorization'] = 'Bearer ' + this.token;

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
      timeout: options.timeout || 30000,
      fmt: options.query && options.query.fmt
    };

    //If callback function is provided, override promise handlers.
    if (callback) {
      var resolve = function(res) {
        callback(null, res);
      };

      var reject = function(err) {
        callback(err);
      };

      _http.request(httpOptions, resolve, reject); 
    }
    
    //If no callback function is provided and promises are supported, use them.
    else {
      return new Promise( (resolve, reject) => {
        _http.request(httpOptions, resolve, reject);
      });
    }
  }

}

module.exports = Gfycat;

