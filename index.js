/*jslint node: true */
'use strict';

const _http = require('./util/_http');
const qs = require('querystring');
const tokenSymbol = Symbol();

/**
 *  Gfycat API wrapper
 */
class Gfycat {
  constructor(clientId, clientSecret) {
    this.apiUrl = 'api.gfycat.com';
    //TODO: either remove this client id/secret or replace it with default
    this.clientId = clientId || '2_Uu0k2J';
    this.clientSecret = clientSecret || 'Fo-QAvj4ijte_2b_jBNnX_kU-mI_u4K85LEPlrC8P4krc1LtaLTZkczGWq5Nj1Dl';
    this.promiseSupport = typeof Promise !== 'undefined';
    this[tokenSymbol] = '';
  }

  _getToken() {
    return this[tokenSymbol];
  }

  _setToken(token) {
    if (token) {
      this[tokenSymbol] = token;
    } else {
      throw new Error('Please provide a valid token');
    }
  }

  /**
   *  Authenticate
   *
   *  @param opts
   *    opts.grant_type {String} - grant type ('authorization_code' || 'client_credentials' || 'password')
   *    opts.username {String} - (only required for password grant) Gfycat username
   *    opts.password {String} - (only required for password grant) Gfycat password
   *    opts.code {String} - (only required for authorization_code grant) Code received from Gfycat web Oauth flow
   *    opts.redirect_uri {String} - (only required for authorization_code grant) Url to redirect to after successful login
   */
  authenticate(opts, callback) {
    var postData = {
      client_id : this.clientId,
      client_secret : this.clientSecret
    };

    switch (opts.grant_type) {
      case 'authorization_code':
        postData.grant_type = 'authorization_code';
        postData.code = opts.code;
        postData.redirect_uri = opts.redirect_uri;
        break;
      case 'client_credentials':
        postData.grant_type = 'client_credentials';
        break;
      case 'password':
        postData.grant_type = 'password';
        postData.username = opts.username;
        postData.password = opts.password;
        break;
      default:
        break;
    }

    var options = {
      path: '/v1/oauth/token',
      method: 'POST',
      postData: postData
    };

    if (callback) {
      this._request(options, (err, data) => {
        if (err) {
          return callback(err);
        } else {
          this._setToken(data.access_token);
          return callback(null, data);
        }
      });
    } 
    
    else {
      return new Promise( (resolve, reject) => {
        this._request(options, (err, data) => {
          if (err) reject(err);
          else {
            this._setToken(data.access_token);
            resolve(data);
          }
        });
      });
    }
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

    if (this[tokenSymbol]) headers.Authorization = 'Bearer ' + this[tokenSymbol];

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
