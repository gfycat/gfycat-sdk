(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["GfycatSDK"] = factory();
	else
		root["GfycatSDK"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

module.exports = {
    'default': 'RFC3986',
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return value;
        }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    var obj;

    while (queue.length) {
        var item = queue.pop();
        obj = item.obj[item.prop];

        if (Array.isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }

    return obj;
};

exports.arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

exports.merge = function merge(target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        } else if (typeof target === 'object') {
            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (Array.isArray(target) && !Array.isArray(source)) {
        mergeTarget = exports.arrayToObject(target, options);
    }

    if (Array.isArray(target) && Array.isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                if (target[i] && typeof target[i] === 'object') {
                    target[i] = exports.merge(target[i], item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = exports.merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

exports.assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

exports.decode = function (str) {
    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};

exports.encode = function encode(str) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

exports.compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    return compactQueue(queue);
};

exports.isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

exports.isBuffer = function isBuffer(obj) {
    if (obj === null || typeof obj === 'undefined') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stringify = __webpack_require__(5);
var parse = __webpack_require__(4);
var formats = __webpack_require__(0);

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/* globals XMLHttpRequest */

/**
 * Browser based http request
 * @param options {Object}
 *   options.request {Object} - Request data
 *      request.headers {Object} - (optional) HTTP headers to be sent with the request
 *      request.method {String} - HTTP method
 *      request.payload {Object} - (optional) JSON data to be sent with POST request
 *      request.url {String} - API url
 *   options.timeout {Number} - (optional) Request timeout before returning an error. Defaults to 30000 milliseconds
 */
exports.request = function(options, resolve, reject) {
  var timeout = options.timeout || 30000;

  var timer = setTimeout(function() {
    xhr.abort();
    reject(new Error('API request exceeded timeout of', timeout));
  }, timeout);

  var xhr = new XMLHttpRequest();

  function handleError(err) {
    clearTimeout(timer);
    err = err || new Error('API request failed');
    reject(err);
  }

  function handleResponse(res) {
    clearTimeout(timer);

    if (xhr.status >= 400) return reject(xhr.status);

    var body = xhr.response;
    try {
      body = JSON.parse(body);
      resolve(body)
    } catch (e) {
      reject(e)
    }
  }

  xhr.addEventListener('error', handleError);
  xhr.addEventListener('abort', handleError);
  xhr.addEventListener('load', handleResponse);

  xhr.open(options.request.method, options.request.url, true);

  var headers = options.request.headers || null;
  if (headers) {
    Object.keys(headers).forEach(function(header) {
      xhr.setRequestHeader(header, headers[header])
    })
  }

  var data = JSON.stringify(options.request.payload) || null;

  if (!data) {
    xhr.send();
  } else {
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
  }
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(1);

var has = Object.prototype.hasOwnProperty;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    parameterLimit: 1000,
    plainObjects: false,
    strictNullHandling: false
};

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);

    for (var i = 0; i < parts.length; ++i) {
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder);
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder);
            val = options.decoder(part.slice(pos + 1), defaults.decoder);
        }
        if (has.call(obj, key)) {
            obj[key] = [].concat(obj[key]).concat(val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options) {
    var leaf = val;

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]') {
            obj = [];
            obj = obj.concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys
        // that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

module.exports = function (str, opts) {
    var options = opts ? utils.assign({}, opts) : {};

    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    options.ignoreQueryPrefix = options.ignoreQueryPrefix === true;
    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(1);
var formats = __webpack_require__(0);

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
        return prefix + '[]';
    },
    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
        return prefix;
    }
};

var toISO = Date.prototype.toISOString;

var defaults = {
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify( // eslint-disable-line func-name-matching
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (Array.isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (Array.isArray(obj)) {
            values = values.concat(stringify(
                obj[key],
                generateArrayPrefix(prefix, key),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        } else {
            values = values.concat(stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        }
    }

    return values;
};

module.exports = function (object, opts) {
    var obj = object;
    var options = opts ? utils.assign({}, opts) : {};

    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
    if (typeof options.format === 'undefined') {
        options.format = formats['default'];
    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
        throw new TypeError('Unknown format option provided.');
    }
    var formatter = formats.formatters[options.format];
    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (Array.isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    } else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (sort) {
        objKeys.sort(sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        keys = keys.concat(stringify(
            obj[key],
            key,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encode ? encoder : null,
            filter,
            sort,
            allowDots,
            serializeDate,
            formatter,
            encodeValuesOnly
        ));
    }

    var joined = keys.join(delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    return joined.length > 0 ? prefix + joined : '';
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var queryString = __webpack_require__(2);
var httpService = __webpack_require__(3);

var API_HOSTNAME = 'https://api.gfycat.com';
var API_BASE_PATH = '/v1';

// Check for Promise support
var promisesExist = typeof Promise !== 'undefined';

/**
 * @callback requestCallback - callback function to run when the request completes.
 * @param {Error} error
 * @param response
 */

/**
 * Error handler that supports promises and callbacks
 * @param {string} err - Error message
 * @param {requestCallback} callback
 * @ignore
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
 * @param {Object} options
 * @param {string} options.client_id - Gfycat API client id.
 * @param {string} options.client_secret - Gfycat API secret.
 * @param {number} options.timeout - (optional) API timeout limit in milliseconds (default is 30000).
 * @class
 */
var GfycatSDK = function(options) {
  if (typeof options === 'object' && options.hasOwnProperty('client_id') && options.hasOwnProperty('client_secret')) {
    this.client_id = options.client_id;
    this.client_secret = options.client_secret;
    this.timeout = options.timeout || 30000;
  } else if (typeof options === 'undefined' || !options) {
    console.error('Although some of our API endpoints can be used without an API key, in order to get the best experience, we strongly recommend that you obtain an API key and initialize this SDK with the provided client_id and client_secret. Get your API key today by visiting https://developers.gfycat.com/signup');
    API_BASE_PATH = '/v1test';
  } else {
    throw new Error('Please provide a valid options object with client_id and client_secret.')
  }

  this.apiUrl = API_HOSTNAME + API_BASE_PATH;
  this.retryLimit = 2;
};


GfycatSDK.prototype = {
  /**
   * Retrieve Oauth token.
   *
   * @param options - (optional if id and secret were provided in constructor)
   * @param {string} options.client_id - Gfycat client id.
   * @param {string} options.client_secret - Gfycat client secret.
   * @param {string} options.grant_type - Oauth grant type. 'client_credentials' by default.
   * @param {requestCallback} callback - (optional) callback function to run when the request completes.
   */
  authenticate: function(options, callback) {
    if (!options) options = {};
    if (!(this.client_id || this.client_secret) && !(options.client_id || options.client_secret)) {
      return _handleErr('Please provide client_id and client_secret in options', callback);
    }

    var options = {
      api: '/oauth',
      endpoint: '/token',
      method: 'POST',
      payload: {
        client_id: options.client_id || this.client_id,
        client_secret: options.client_secret || this.client_secret,
        grant_type: options.grant_type || 'client_credentials'
      }
    }

    var self = this;

    if (callback) {
      return this._request(options, function(err, res) {
        if (!err) {
          self._setToken(res);
          callback(null, res);
        } else callback(err);
      })
    } else {
      return this._request(options)
        .then(function(res) {
          self._setToken(res);
          Promise.resolve(res);
        })
        .catch(function(err) {
          Promise.reject(err);
        })
    }
  },

  /**
   * Retrieve JSON array of reactions/categories.
   *
   * @param {Object} options
   * @param {number} options.gfyCount - number of GIFs to include per category.
   * @param {string} options.locale - locale for requested language.
   * @param {string} options.cursor - cursor for pagination.
   * @param {requestCallback} callback - (optional) callback function to run when the request completes.
   */
  getCategories: function getCategories(options, callback) {
    if (!options) options = {};

    return this._request({
      api: '/reactions',
      endpoint: '/populated',
      method: 'GET',
      query: {
        gfyCount: options.gfyCount || 1,
        count: options.count || null,
        cursor: options.cursor || null,
        locale: options.locale || null
      }
    }, callback);
  },

  /**
   * Retrieve JSON array of GIFs in a specific category/reaction specified by tagName.
   *
   * Note: with the exception of "trending" category,
   * GIFs belonging to all other reaction categories can be retrieved using the search endpoint.
   * If the search term used is a category/reaction name, the search API will automatically give
   * precedence to GIFs that belong in that category.
   *
   * @param {Object} options
   * @param {number} options.gfyCount - number of GIFs to return.
   * @param {string} options.cursor - cursor for pagination.
   * @param {string} options.tagName - name of the category/reaction.
   * @param {requestCallback} callback - (optional) callback function to run when the request completes.
   */
  getTrendingCategories: function getTrendingCategories(options, callback) {
    if (!options) options = {};

    return this._request({
      api: '/reactions',
      endpoint: '/populated',
      method: 'GET',
      query: {
        gfyCount: options.gfyCount || 1,
        cursor: options.cursor || null,
        tagName: options.tagName || 'trending'
      }
    }, callback)
  },

  /**
   * Retrieve JSON array of trending GIFs for a given tag.
   * If no tag name is provided, the API returns overall trending GIFs.
   *
   * @param {Object} options
   * @param {number} options.count - number of GIFs to include per category.
   * @param {string} options.cursor - cursor for pagination.
   * @param {string} options.tagName - (optional) - name of the tag to get trending GIFs from.
   * @param {requestCallback} callback - (optional) callback function to run when the request completes.
   */
  getTrending: function getTrending(options, callback) {
    if (!options) options = {};

    return this._request({
      api: '/gfycats',
      endpoint: '/trending',
      method: 'GET',
      query: {
        count: options.count || 100,
        cursor: options.cursor || null,
        tagName: options.tagName || null
      }
    }, callback);
  },

  /**
   * Retrieve JSON array of trending tags.
   *
   * @param {Object} options
   * @param {string} options.cursor - cursor for pagination.
   * @param {requestCallback} callback - (optional) callback function to run when the request completes.
   */
  getTrendingTags: function getTrendingTags(options, callback) {
    if (!options) options = {};

    return this._request({
      api: '/tags',
      endpoint: '/trending',
      method: 'GET'
    }, callback);
  },

  /**
   * Retrieve JSON array of trending tags.
   *
   * @param {Object} options
   * @param {string} options.cursor - cursor for pagination.
   * @param {number} options.gfyCount - total number of gifs to return for each tag.
   * @param {number} options.tagCount - total number of tags to return.
   * @param {requestCallback} callback - (optional) callback function to run when the request completes.
   */
  getTrendingTagsPopulated: function getTrendingTagsPopulated(options, callback) {
    if (!options) options = {};

    return this._request({
      api: '/tags',
      endpoint: '/trending/populated',
      method: 'GET',
      query: {
        count: options.count || 100,
        cursor: options.cursor || null,
        gfyCount: options.gfyCount || 1
      }
    }, callback);
  },

  /**
   * Search all GIFs. For pagination, please only specify either cursor (& count), or count & start.
   *
   * @param {Object} options
   * @param {string} options.search_text - search query term or phrase.
   * @param {number} options.count - (optional) number of results to return, defaults to 100.
   * @param {number} options.start - (optional) results offset, defaults to 0.
   * @param {string} options.cursor - cursor for pagination.
   * @param {requestCallback} callback - (optional) callback function to run when the request completes.
   */
  search: function(options, callback) {
    return this._request({
      api: '/gfycats',
      endpoint: '/search',
      method: 'GET',
      query: {
        search_text: options.search_text,
        count: options.count || 100,
        start: options.start || null,
        cursor: options.cursor || null
      }
    }, callback);
  },

  /**
   * Search a single gif by gfyId.
   *
   * @param {Object} options
   * @param {string} options.id - gfycat id
   * @param {requestCallback} callback - (optional) callback function to run when the request completes.
   */
  searchById: function(options, callback) {
    return this._request({
      api: '/gfycats',
      endpoint: '/' + options.id,
      method: 'GET'
    }, callback);
  },

  /**
   * Get a list of gifs related to a given gif
   *
   * @param {Object} options
   * @param {string} options.id - gfycat id
   * @param {requestCallback} callback - (optional) callback function to run when the request completes.
   */
  getRelatedContent: function(options, callback) {
    return this._request({
      api: '/gfycats',
      endpoint: '/' + options.id + '/related',
      method: 'GET',
      query: {
        cursor: options.cursor,
        count: options.count,
        from: options.from
      }
    }, callback);
  },

  /**
   * @param {Object} options
   * @param {string} options.uploadKey - the key of the upload.
   * @param {string[]} options.tags - the tags to associate with this gfycat
   * @param {requestCallback} callback - (optional) callback function to run when the request completes.
   */
  artifacts: function(options, callback) {
    return this._request({
      api: '/gifartifacts',
      endpoint: '',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      payload: {
        uploadKey: options.uploadKey,
        tags: options.tags
      }
    }, callback);
  },

  /**
   * @param {Object} options
   * @param {string} options.search_text - (optional) Search query
   * @param {string} options.cursor - (optional) Cursor for pagination
   * @param {number} options.count - (optional) Number of GIFs to return.
   * @param {requestCallback} callback - (optional) callback function to run when the request completes.
   */
  stickers: function(options, callback) {
    return this._request({
      api: '/stickers',
      endpoint: options.search_text ? '/search' : '',
      method: 'GET',
      query: {
        cursor: options.cursor,
        count: options.count,
        search_text: options.search_text
      }
    });
  },

  /**
   * Prepares the HTTP request and query string
   *
   * @param {Object} options
   * @param {string} options.api - API type.
   * @param {string} options.endpoint - The API method.
   * @param {string} options.method - The http method to be used.
   * @param {Object} options.payload - JSON data to be sent in POST requests.
   * @param {Object} options.query - (optional) Query string parameters.
   * @param {number} options.timeout - (optional) API timeout limit in milliseconds.
   * @param {requestCallback} callback - (optional) callback function to run when the request completes.
   * @ignore
   */
  _request: function(options, callback) {
    if (!callback && !promisesExist) {
      throw new Error('Callback must be provided if promises are unavailable');
    }

    if (typeof options === 'undefined' || !options) {
      return _handleErr('Please provide valid options object', callback);
    }

    var counter = options.counter || 0;

    if (counter >= this.retryLimit) {
      if (callback) _handleErr('Retry limit reached', callback);
      else return Promise.reject('Retry limit reached')
    }

    var token = this.access_token ?
      'Bearer ' + this.access_token : null;

    if (token) {
      if (typeof options.headers === 'undefined') options.headers = {};
      options.headers['Authorization'] = this.access_token;
    }

    var query = '';

    if (typeof options.query === 'object' && Object.keys(options.query).length) {

      // Omit null values from querystring
      for (var key in options.query) {
        // Using == intentionally to match null and undefined
        if (options.query[key] == null) {
          delete options.query[key]
        }
      }

      query = '?' + queryString.stringify(options.query);
    }

    var httpOptions = {
      request: {
        headers: options.headers || null,
        method: options.method,
        payload: options.payload || null,
        url: this.apiUrl + options.api + options.endpoint + query
      },
      timeout: options.timeout || this.timeout
    };

    var self = this;

    if (callback) {
      var resolve = function(res) {
        callback(null, res);
      };
      var reject = function(err) {
        if (err === 401 && options.api !== '/oauth') {
          self.authenticate({}, function(err, res) {
            if (err) callback(err);
            else {
              options.counter = counter + 1;
              return self._request(options, callback);
            }
          })
        } else {
          callback(err);
        }
      };
      httpService.request(httpOptions, resolve, reject);
    }

    else {
      return new Promise(function(resolve, reject) {
        httpService.request(httpOptions, resolve, reject)
      })
        .then(function(res) {
          return Promise.resolve(res);
        })
        .catch(function(err) {
          if (err === 401 && options.api !== '/oauth') {
            return self.authenticate({})
              .then(function(res) {
                options.counter = counter + 1;
                return self._request(options);
              })
              .catch(function(err) {
                return Promise.reject(err);
              });
          } else {
            return Promise.reject(err);
          }
        });
    }
  },

  _setToken: function(options) {
    this.access_token = options.access_token;
    this.token_type = options.token_type;
  }
};

module.exports = GfycatSDK;


/***/ })
/******/ ]);
});
//# sourceMappingURL=gfycat-sdk.umd.bundle.js.map