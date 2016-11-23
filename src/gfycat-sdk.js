/*jslint node: true */

import _http from './util/_http'
import qs from 'querystring'

const tokenSymbol = Symbol();

/**
 *  Gfycat API wrapper class
 */
export default class Gfycat {

  /**
   *  Create a Gfycat SDK object.
   *  @param {string} clientId - Client id retrieved from the developers portal.
   *  @param {string} clientSecret - Client secret retrieved from the developers portal.
   */
  constructor({clientId, clientSecret} = {}) {
    this.apiUrl = 'api.gfycat.com';
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.promiseSupport = typeof Promise !== 'undefined';
    this[tokenSymbol] = '';
  }


  /**
   *  Authenticate using client id and secret, and store the retrieved access token in the class instance to be used implicitly by other methods.
   *  @callback {callback} [callback] - Optional callback function to be executed upon API response.
   *  @return {}
   */
  authenticate(callback) {
    let postData = {
      grant_type : 'client_credentials',
      client_id : this.clientId,
      client_secret : this.clientSecret,
      scope: 'scope' // Currently does not do anything
    };

    let options = {
      hostname: this.apiUrl,
      path: '/v1/oauth/token',
      method: 'POST',
      postData: postData
    };

    if (callback) {
      this._request(options, (err, data) => {
        if (err) {
          return callback(err);
        } else {
          this[tokenSymbol] = data.access_token
          return callback(null, data);
        }
      });
    } 
    
    else {
      return new Promise( (resolve, reject) => {
        this._request(options, (err, data) => {
          if (err) reject(err);
          else {
            this[tokenSymbol] = data.access_token;
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

    let path = '/v1/users/' + username;

    let options = {
      hostname: this.apiUrl,
      path: path,
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
   *  Create User
   *  Not testing yet. Don't want to create a bunch of random users.
   */
  // createUser(opts, callback) {
  //   // if (!opts || !opts.hasOwnProperty('username')) {
  //   //   return this.handleError('invalid Object', callback);
  //   // }

  //   if (callback) {
  //     this.checkUsername(opts.username
  //       , (err, data) => {
  //         if (err) return this.handleError('Username Taken', callback);
  //         if (!data) return this.handleError('Invalid Username', callback);
  //       });
  //   } else {
  //     this.checkUsername(opts.username)
  //       .then(data => {
  //         if (!data) return this.handleError('Invalid Username', callback);
  //       }, err => {
  //         return this.handleError('Username Taken', callback);
  //       });
  //   }

  //   var options = {
  //     hostname: this.apiUrl,
  //     path: '/v1/users',
  //     method: 'POST',
  //     query: opts
  //   };

  //   return this._request(options, callback);
  // }


  /**
   *  Search
   *
   *  @param {Object}  
   */
  search({search_text, random = false, count = 1, cursor, first} = {}, callback) {
    if (typeof search_text === 'undefined') {
      return this.handleError('Please specify a search term', callback);
    }

    let queryParams = {
      search_text: search_text,
      count: count
    };

    if (random) queryParams.random = true;
    if (cursor) queryParams.cursor = cursor;
    if (first) queryParams.first = first;

    let options = {
      hostname: this.apiUrl,
      path: '/v1/gfycats/search',
      method: 'GET',
      query: queryParams
    };

    return this._request(options, callback);
  }


  /**
   * Get User info by ID
   */
  getUserDetails(userID, callback) {
    if (typeof userID === 'undefined' || userID == null) {
      return this.handleError('invalid userID', callback);
    }

    var path = '/v1/users/' + userID;

    var options = {
      hostname: this.apiUrl,
      path: path,
      method: 'GET'
    };

    return this._request(options, callback);
  }


  /**
   * Get Gfy info by ID
   */
  getGifDetails(gfyID, callback) {
    if (typeof gfyID === 'undefined' || gfyID == null) {
      return this.handleError('invalid gfyID', callback);
    }

    var path = '/v1test/gfycats/' + gfyID;

    var options = {
      hostname: this.apiUrl,
      path: path,
      method: 'GET'
    };

    return this._request(options, callback);
  }


  /**
   * User feed 
   */
  userFeed(userID, callback) {
    if (typeof userID === 'undefined' || userID == null) {
      return this.handleError('invalid gfyID', callback);
    }

    var path = '/v1/users/' + userID + '/gfycats';

    var options = {
      hostname: this.apiUrl,
      path: path,
      method: 'GET'
    };

    return this._request(options, callback);
  }


  /**
   *  Trending
   */
  trendingGifs(opts = {}, callback) {
    if (!("count" in opts)) opts.count = 1;

    var options = {
      hostname: this.apiUrl,
      path: '/v1/gfycats/trending',
      method: 'GET',
      query: opts
    };

    return this._request(options, callback);
  }


  /**
   *  Trending tags
   */
  trendingTags(opts, callback) {
    var path = '/v1/tags/trending';
    if (!opts) opts = {};
    if (opts.populated) path += '/populated';
    // if (cursor) queryParams.cursor = cursor;

    var options = {
      hostname: this.apiUrl,
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

    var options = {
      hostname: this.apiUrl,
      path: '/v1/gfycats',
      method: 'POST',
      postData: opts
    };

    return this._request(options, callback);
  }

  /**
   *  Upload file by PUT request.
   *  For files under 5 MB.

      Filesize is required in params
   */
  // uploadFileByPUT(keyname, opts, callback) {
  //   if (!opts) opts = {};
  //   if (!keyname) opts = '';
  //   path = keyname;

  //   var options = {
  //     hostname: 'https://filedrop.gfycat.com/',
  //     path: keyname,
  //     method: 'PUT',
  //     postData: opts
  //   };

  //   return this._request(options, callback);
  // };

  /**
   *  Upload by File
      fileinfo = {
        filePath: PATH
        fileName: NAME
        contentType: contenttype (ex: video/mp4)
      }
   */
  // uploadFile(opts, fileinfo, callback) {
  //   if (!opts) opts = {};
  //   if (!fileinfo) fileinfo = {};
  //   if (!fileinfo.filePath) fileinfo.filePath = '';
  //   //TODO: Add validation logic for options object

  //   var form = req.form();
  //   form.append('file', fs.createReadStream(fileinfo.filePath));

  //   var options = {
  //     hostname: 'https://filedrop.gfycat.com',
  //     method: 'POST',
  //     postData: opts,
  //     formData: form
  //   };

  //   // return this._request(options, callback);

  //   request.post(options, function optionalCallback(err, httpResponse, body) {
  //     if (err) {
  //       return console.error('upload failed:', err);
  //     }
  //     console.log('Upload successful!  Server responded with:', body);
  //   });
  // }

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

