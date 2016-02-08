var optimizedEncodeUri = require('./optimizedEncodeUri');

module.exports = function (buffer, mediaType) {
  if (mediaType === 'image/svg+xml') {
    return optimizedEncodeUri(buffer.toString('utf8'));
  }
  return 'base64,' + buffer.toString('base64');
};
