/*jslint node: true */
'use strict';

const _http = require('./util/_http');
const qs = require('querystring');
// const fs = require('fs');

/**
 *  Gfycat API wrapper
 */
class Gfycat {
  constructor(clientId, clientSecret) {
    this.apiUrl = 'api.gfycat.com';
    this.clientId = clientId || '2_Uu0k2J';
    this.clientSecret = clientSecret || 'Fo-QAvj4ijte_2b_jBNnX_kU-mI_u4K85LEPlrC8P4krc1LtaLTZkczGWq5Nj1Dl';
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
  checkUsername(username, callback) {
    if (typeof username === 'undefined' || username == null) {
      return this.handleError('invalid username', callback);
    }

    var path = '/v1/users/' + username;

    var options = {
      hostname: this.apiUrl,
      path: path,
      method: 'HEAD'
    };

    if (callback) {
      this._request(options, (err, data) => {
        if (err) {
          if ([401, 404, 422].indexOf(err.statusCode) > -1) {
            return callback(null, err);
          } else {
            callback(err);
          }
        } else {
          return callback(null, data);
        }
      });
    } 
    
    else {
      return new Promise( (resolve, reject) => {
        this._request(options, (err, data) => {
          if (err) {
            if ([401, 404, 422].indexOf(err.statusCode) > -1) {
              resolve(err);
            }
            else {
              reject(err);
            }
          } else {
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
      hostname: this.apiUrl,
      path: '/v1/gfycats/search',
      method: 'GET',
      query: queryParams
    };

    return this._request(options, callback);
  }

  /**
   * Get info by ID
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
   * Get info by ID
   */
  getGifDetails(gfyID, callback) {
    if (typeof gfyID === 'undefined' || gfyID == null) {
      return this.handleError('invalid gfyID', callback);
    }

    var path = '/v1test/gfycats/' + gfyID;
    // if ('gfyID' in opts) path += opts.gfyID;

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
  trendingGifs(opts, callback) {
    if (!opts) opts = {};
    if (!('count' in opts)) opts.count = 1;

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
    if (!opts) opts = {};
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

    if (this.token) headers.Authorization = 'Bearer ' + this.token;

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
