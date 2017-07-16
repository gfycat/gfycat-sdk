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
      resolve({})
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

  if (options.request.file) {
    xhr.send(options.request.file);
  } else {
    var data = JSON.stringify(options.request.payload) || null;

    if (!data) {
      xhr.send();
    } else {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(data);
    }
  }
}
