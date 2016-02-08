/* eslint quotes: 0 */

var optimizedEncodeUri = require('../../lib/__utils__/optimizedEncodeUri');
var test = require('ava');

test('encodes unsafe characters', function (t) {
  var result = optimizedEncodeUri("<path id='#' width=\"100%\" data='&'>");
  t.is(result, "%3Cpath id='%23' width=%22100%25%22 data='%26'%3E");
});

test('trims whitespace', function (t) {
  var result = optimizedEncodeUri('  foo   ');
  t.is(result, 'foo');
});

test('collapses extra whitespace', function (t) {
  var result = optimizedEncodeUri('foo   bar');
  t.is(result, 'foo bar');
});
