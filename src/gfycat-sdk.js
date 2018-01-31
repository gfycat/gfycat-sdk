/*jslint node: true */

import _http from './util/_http'
import qs from 'querystring'

/**
 *  Gfycat API wrapper class
 */
export default class Gfycat {

  /**
   *  Create a Gfycat SDK object.
   *  @param {string} grantType - This field determines which grant type you are requesting, for the client credentials grant this value is client_credentials.
   *  @param {string} clientId - Client id retrieved from the developers portal.
   *  @param {string} clientSecret - Client secret retrieved from the developers portal.
   *  @param {string} username - Gfycat username linked to your API account.
   *  @param {string} password - Gfycat password linked to your API account.
   */
  constructor({grantType, clientId, clientSecret, username, password} = {}) {
    this.apiUrl = 'api.gfycat.com';
    this.apiVersion = '/v1';
    this.promiseSupport = typeof Promise !== 'undefined';
    this.token = '';
    this.retryLimit = 2;

    if (!!grantType) this.grantType = grantType;
    if (!!clientId) this.clientId = clientId;
    if (!!clientSecret) this.clientSecret = clientSecret;
    if (!!username) this.username = username;
    if (!!password) this.password = password;
  }


  /**
   *  Authenticate using client id and secret, and store the retrieved access token in the class instance to be used implicitly by other methods.
   *  @callback {callback} [callback] - Optional callback function to be executed upon API response.
   *  @return {}
   */
  authenticate(callback) {
    let postData = {
      grant_type : this.grantType || 'client_credentials',
      client_id : this.clientId,
      client_secret : this.clientSecret,
      username: this.username,
      password: this.password,
      scope: 'scope' // Currently does not do anything
    };

    let options = {
      path: '/oauth/token',
      method: 'POST',
      postData: postData
    };

    if (callback) {
      this._request(options, (err, data) => {
        if (err) {
          return callback(err);
        } else {
          this.token = data.access_token
          return callback(null, data);
        }
      });
    }

    else {
      return new Promise( (resolve, reject) => {
        this._request(options, (err, data) => {
          if (err) reject(err);
          else {
            this.token = data.access_token;
            resolve(data);
          }
        });
      });
    }
  }


  /**
   * Checking if the username is available / username exists / username is valid
   */
  checkUsername({username = ''} = {}, callback) {
    if (typeof username === 'undefined' || !username || username.length === 0) {
      return this.handleError('invalid username', callback);
    }

    let options = {
      path: '/users/' + username,
      method: 'GET'
    };

    if (callback) {
      this._request(options, (err, data) => {
        if (data) {
          return callback(null, false);
        } else {
          if ([401, 403, 422].indexOf(err.statusCode) > -1) {
            return callback(err);
          } else {
            return callback(null, true);
          }
        }
      });
    }

    else {
      return new Promise( (resolve, reject) => {
        this._request(options, (err, data) => {
          if (data || [401, 422].indexOf(err.statusCode) > -1) {
            resolve(false);
          } else if (err && err.statusCode === 404) {
            resolve(true);
          } else {
            reject(err);
          }
        });
      });
    }
  }


  /**
   *  Search
   *
   *  @param {Object}
   */
  search({search_text, random = false, count = 1, cursor, first} = {}, callback) {
    if (typeof search_text === 'undefined') {
      return this.handleError('Please specify a search_text attribute.', callback);
    }

    if (!!cursor && !!first) {
      return this.handleError('Please do not specify both cursor and first attributes. Only use one or the other.', callback);
    }

    let queryParams = {
      search_text: search_text,
      count: count
    };

    if (random) queryParams.random = true;
    if (cursor) queryParams.cursor = cursor;
    if (first) queryParams.first = first;

    let options = {
      path: '/gfycats/search',
      method: 'GET',
      query: queryParams
    };

    return this._request(options, callback);
  }


  /**
   * Get User info by ID
   */
  getUserDetails({userId} = {}, callback) {
    if (typeof userId === 'undefined' || userId === null || userId.length === 0) {
      return this.handleError('invalid userId', callback);
    }

    let options = {
      path: '/users/' + userId,
      method: 'GET'
    };

    return this._request(options, callback);
  }


  /**
   * Get Gfy info by ID
   */
  getGifDetails({gfyId} = {}, callback) {
    if (typeof gfyId === 'undefined' || gfyId === null || gfyId.length === 0) {
      return this.handleError('invalid gfyId', callback);
    }

    let options = {
      path: '/gfycats/' + gfyId,
      method: 'GET'
    };

    return this._request(options, callback);
  }

  /**
   * Get a list of categories
   */
  getCategories({gfyCount} = {}, callback) {
    let options = {
      path: '/reactions/populated',
      method: 'GET',
      query: {
        gfyCount: gfyCount || 1
      }
    }

    return this._request(options, callback)
  }

  /**
   * Get gifs for trending category
   */
  getTrendingCategories({tagName = 'trending', gfyCount = 1, cursor = null}, callback) {
    let queryParams = {
      tagName,
      gfyCount,
      cursor
    }

    let options = {
      path: '/reactions/populated',
      method: 'GET',
      query: queryParams
    }

    return this._request(options, callback)
  }


  /**
   * User feed
   */
  userFeed({userId} = {}, callback) {
    if (typeof userId === 'undefined' || userId === null || userId.length === 0) {
      return this.handleError('invalid gfyId', callback);
    }

    let options = {
      path: '/users/' + userId + '/gfycats',
      method: 'GET'
    };

    return this._request(options, callback);
  }


  /**
   *  Trending
   */
  trendingGifs(opts = {count: 1}, callback) {

    var options = {
      path: '/gfycats/trending',
      method: 'GET',
      query: opts
    };

    return this._request(options, callback);
  }


  /**
   *  Trending tags
   */
  trendingTags(opts, callback) {
    let path = '/tags/trending';
    if (!opts) opts = {};
    if (opts.populated) path += '/populated';
    // if (opts.cursor) queryParams.cursor = cursor;

    let options = {
      path: path,
      method: 'GET',
      query: opts
    };

    return this._request(options, callback);
  }


  /**
   *  Upload by URL
   */
  upload(opts, callback) {
    if (!opts) return this.handleError('invalid Object', callback);

    let options = {
      path: '/gfycats',
      method: 'POST',
      postData: opts
    };

    return this._request(options, callback);
  }


  /**
   *  Check upload status
   */
  checkUploadStatus(gfyId, callback) {
    let options = {
      path: '/gfycats/fetch/status/' + gfyId,
      method: 'GET'
    };

    return this._request(options, callback);
  }


  handleError(message, callback) {
    if (callback) return callback(new Error(message));
    else return Promise.reject(new Error(message));
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

    if (this.token) headers.Authorization = 'Bearer ' + this.token;

    if (options.headers) {
      headers = Object.assign(headers, options.headers);
    }

    const counter = options.counter || 0;
    if (counter >= this.retryLimit) {
      return this.handleError('Retry limit reached', callback);
    }

    var httpOptions = {
      request: {
        hostname: this.apiUrl,
        path: this.apiVersion + apiPath,
        method: options.method || 'GET',
        headers: headers
      },
      postData: options.postData || '',
      timeout: options.timeout || 30000,
      fmt: options.query && options.query.fmt
    };

    //If callback function is provided, override promise handlers.

    if (callback) {
      var resolve = (res)=>{
        callback(null, res);
      };

      var reject = (err)=>{
        // authenticate returns 401 when the credentials are invalid.
        if (err.statusCode === 401 && options.path != '/oauth/token') {
          this.authenticate((err, res) => {
            if (err) callback(err);
            else {
              options.counter = counter + 1;
              this._request(options, callback);
            }
          });
        } else {
          callback(err);
        }
      };
      _http.request(httpOptions, resolve, reject);
    }

    //If no callback function is provided and promises are supported, use them.
    else {
      return new Promise((resolve, reject) => {
        _http.request(httpOptions, resolve, reject);
      })
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        // authenticate returns 401 when the credentials are invalid.
        if (err.statusCode === 401 && options.path != '/oauth/token') {
          return this.authenticate()
            .then((res) => {
              options.counter = counter + 1;
              return this._request(options);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        } else {
          return Promise.reject(err);
        }
      });
    }
  }

}
