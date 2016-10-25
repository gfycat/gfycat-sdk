'use strict';

const https = require('https');
const zlib = require('zlib');


/**
 * Server-side https request
 * @param options {Object}
 *   options.request {Object} - Request data including method, host and path
 *   options.timeout {Number} - Request timeout before returning an error. Defaults to 30000 milliseconds
 *   options.fmt {String} - Return results in html or json format (useful for viewing responses as GIFs to debug/test)
 *   options.postData {Object} - Post data to be written to request stream
 */

exports.request = (options, resolve, reject) => {
  var timeout = options.timeout;
  var format = options.fmt;

  var req = https.request(options.request, res => {
    switch (res.headers['content-encoding']) {
      case 'gzip' || 'deflate':
        var output = zlib.createUnzip();
        res.pipe(output);
        break;
      default:
        var output = res;
        break;
    }

    if (res.statusCode === 401) {
      return reject(res.statusMessage);
    }

    let body = '';

    output.on('data', d => {
      body += d;
    });

    output.on('end', () => {
      if (format !== 'html') body = JSON.parse(body);
      return resolve(body);
    });

    output.on('error', err => {
      return reject(err);
    });
  });

  req.on('error', err => {
    return reject(err);
  });

  if (options.postData) {
    req.write(JSON.stringify(options.postData));
    req.end();
  }

  req.on('socket', socket => {
    socket.setTimeout(timeout);
    socket.on('timeout', () => {
      req.abort();
    });
  });
};

