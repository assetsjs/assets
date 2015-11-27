var measure = require('../lib/measure');
var path = require('path');
var test = require('ava');

test('no options', function (t) {
  return measure('fixtures/duplicate-1.jpg')
    .then(function (size) {
      t.same(size, { width: 200, height: 114 });
    }, t.fail);
});

test('with options', function (t) {
  return measure('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  })
    .then(function (size) {
      t.same(size, { width: 200, height: 57 });
    }, t.fail);
});

test('non-existing file', function (t) {
  return measure('non-existing.gif')
    .then(t.fail, function (err) {
      t.ok(err instanceof Error);
      t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    });
});

test('nonsupported file', function (t) {
  return measure('fixtures/fonts/empty-sans.woff')
    .then(t.fail, function (err) {
      t.ok(err instanceof Error);
      t.is(err.message, 'File type not supported: ' + path.resolve('fixtures/fonts/empty-sans.woff'));
    });
});

test('corrupted file', function (t) {
  return measure('fixtures/corrupt.jpg')
    .then(t.fail, function (err) {
      t.ok(err instanceof Error);
      t.is(err.message, 'Invalid JPEG file: ' + path.resolve('fixtures/corrupt.jpg'));
    });
});

test('node-style callback', function (t) {
  t.plan(5);

  measure('fixtures/duplicate-1.jpg', function (err, size) {
    t.same(size, { width: 200, height: 114 });
  });

  measure('non-existing.gif', function (err, size) {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    t.is(size, undefined);
  });

  measure('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  }, function (err, size) {
    t.same(size, { width: 200, height: 57 });
  });
});