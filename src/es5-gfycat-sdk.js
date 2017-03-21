var queryString = require('qs');
var httpService = require('./util/http_browser');

var API_HOSTNAME = 'https://api.gfycat.com';
var API_BASE_PATH = '/v1';

// Check for Promise support
var promisesExist = typeof Promise !== 'undefined';


/**
* Error handler that supports promises and callbacks
* @param err {String} - Error message
* @param callback
*/
function _handleErr(err, callback) {
  if (callback) {
    return callback(err);
  } else if (promisesExist) {
    return Promise.reject(err);
  } else {
    throw new Error(err);
  }
}


/**
* @param options {Object} - Options object.
*   options.client_id {String} - Gfycat API client id.
*   options.client_secret {String} - Gfycat API secret.
*   options.timeout {Number} - (optional) API timeout limit in milliseconds (default is 30000).
*/
var GfycatSDK = function(options) {
  if (typeof options === 'object' && options.hasOwnProperty('client_id') && options.hasOwnProperty('client_secret')) {
    this.client_id = options.client_id;
    this.client_secret = options.client_secret;
    this.timeout = options.timeout || 30000;
  } /*else if (typeof options === 'undefined' || !options) {
    API_BASE_PATH = '/v1test';
    options = {};
  }*/ else {
    throw new Error('Please provide a valid options object with client_id and client_secret.')
  }

  this.apiUrl = API_HOSTNAME + API_BASE_PATH;
};


GfycatSDK.prototype = {
  /**
  * Retrieve Oauth token.
  *
  * @param options {Object}
  *   options.client_id {String} - Gfycat client id.
  *   options.client_secret {String} - Gfycat client secret.
  *   options.grant_type {String} - Oauth grant type. 'client_credentials' by default.
  * @param callback - (optional) callback function to run when the request completes.
  */
  authenticate: function(options, callback) {
    if (!(this.client_id || this.client_secret) && !(options.client_id || options.client_secret)) {
      return _handleErr('Please provide client_id and client_secret in options', callback);
    }

    var options = {
      api: '/oauth',
      endpoint: '/token',
      method: 'POST',
      postData: {
        client_id: options.client_id || this.client_id,
        client_secret: options.client_secret || this.client_secret,
        grant_type: options.grant_type || 'client_credentials'
      }
    }

    var self = this;
    return this._request(options, function(err, res) {
      self.access_token = res.access_token;

      if (callback) {
        if (!err) callback(null, res);
        else callback(err);
      } else {
        if (!promisesExist) {
          throw new Error('Callback must be provided unless Promises are available');
        }
        return new Promise(function(resolve, reject) {
          if (!err) {
            console.log('resolve');
            resolve(self.token);
          } else {
            console.log('reject');
            reject(err);
          }
        });
      }
    });
  },

  /**
  * Search a single gif by gfyId.
  *
  * @param options Gfycat API search options
  *   options.id {String} - search query term or phrase.
  * @param callback - (optional) callback function to run when the request completes.
  */
  searchById: function(options, callback) {
    if (typeof options === 'undefined' || !options || !options.id) {
      return _handleErr('Please provide valid options object', callback);
    }

    return this._request({
      api: '/gfycats',
      endpoint: '/' + options.id,
      method: 'GET'
    }, callback);
  },

  /**
  * Search all GIFs. For pagination, please only specify either cursor (& count), or count & start.
  *
  * @param options Gfycat API search options
  *   options.search_text {String} - search query term or phrase.
  *   options.count {Number} - (optional) number of results to return, defaults to 100.
  *   options.start {Number} - (optional) results offset, defaults to 0.
  *   options.cursor {String} - cursor for pagination.
  * @param callback - (optional) callback function to run when the request completes.
  */
  search: function(options, callback) {
    if (typeof options === 'undefined' || !options || !options.search_text) {
      return _handleErr('Please provide options object', callback);
    }

    return this._request({
      api: '/gfycats',
      endpoint: '/search',
      method: 'GET',
      query: {
        search_text: options.search_text,
        count: options.count || 100,
        start: options.start || 0,
        cursor: options.cursor || null
      }
    }, callback);
  },

  /**
  * Prepares the HTTP request and query string
  *
  * @param options
  *   options.api {String} - API type.
  *   options.endpoint {String} - The API method.
  *   options.method {String} - The http method to be used.
  *   options.postData {Object} - JSON data to be sent in POST requests.
  *   options.query {Object} - (optional) Query string parameters.
  *   options.timeout {Number} - (optional) API timeout limit in milliseconds.
  * @param callback - (optional) Callback function to be invoked upon completed request.
  */
  _request: function(options, callback) {
    if (!callback && !promisesExist) {
      throw new Error('Callback must be provided if promises are unavailable');
    }

    if (typeof options === 'undefined' || !options) {
      return _handleErr('Please provide options object', callback);
    }

    var query = '';

    if (typeof options.query === 'object' && Object.keys(options.query).length) {
      query = '?' + queryString.stringify(options.query);
    }

    var httpOptions = {
      request: {
        method: options.method,
        postData: options.postData || null,
        url: this.apiUrl + options.api + options.endpoint + query
      },
      timeout: options.timeout || this.timeout
    };

    if (callback) {
      var resolve = function(res) {
        callback(null, res);
      };
      var reject = function(err) {
        callback(err);
      };
      httpService.request(httpOptions, resolve, reject);
    } else {
      if (!promisesExist) {
        throw new Error('Callback must be provided unless Promises are available');
      }
      return new Promise(function(resolve, reject) {
        httpService.request(httpOptions, resolve, reject);
      });
    }
  }
};

module.exports = GfycatSDK;
