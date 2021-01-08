const async = require("async");
const extend = require("lodash/extend");
const flatten = require("lodash/flatten");
const glob = require("glob");
const path = require("path");
const Promise = require("bluebird");
const exists = require("./__utils__/exists");

const pglob = Promise.promisify(glob);

module.exports = (to, options, callback) => {
  /* eslint-disable no-param-reassign */

  if (typeof options === "function") {
    callback = options;
    options = {};
  }

  options = extend(
    {
      basePath: ".",
      loadPaths: [],
    },
    options
  );

  /* eslint-enable */

  const loadPaths = [].concat(options.loadPaths);

  return Promise.map(loadPaths, (loadPath) =>
    pglob(loadPath, {
      cwd: options.basePath,
    }).then((matchedPaths) =>
      matchedPaths.map((matchedPath) =>
        path.resolve(options.basePath, matchedPath, to)
      )
    )
  )
    .then((filePaths) => flatten(filePaths))
    .then((filePaths) => {
      filePaths.unshift(path.resolve(options.basePath, to));

      return new Promise((resolve, reject) => {
        async.detectSeries(filePaths, exists, (err, resolvedPath) => {
          if (resolvedPath) {
            resolve(resolvedPath);
          } else {
            reject(new Error(`Asset not found or unreadable: ${to}`));
          }
        });
      });
    })
    .nodeify(callback);
};
