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

exports.request = function(options, resolve, reject) {
  var request = options.request;
  var timeout = options.timeout;
  var format = options.fmt;

  var req = https.request(request, res => {
    switch (res.header['content-encoding']) {
      case 'gzip' || 'deflate':
        res = res.pipe(zlib.createUnzip());
        break;
      default:
        break;
    }

    let body = '';

    res.on('data', d => {
      body += d;
    });

    res.on('end', () => {
      if (format !== 'html') {
        body = JSON.parse(body);
      }
      resolve(body);
    });

    res.on('error', err => {
      reject(err);
    });
  });

  req.on('error', err => {
    reject(err);
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

