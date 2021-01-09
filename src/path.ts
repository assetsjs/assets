import async from "async";
import extend from "lodash/extend";
import flatten from "lodash/flatten";
import glob from "glob";
import path from "path";
import util from "util";
import exists from "./__utils__/exists";

const pglob = util.promisify(glob);

export default (to, options): Promise<any> => {
  /* eslint-disable no-param-reassign */

  options = extend(
    {
      basePath: ".",
      loadPaths: [],
    },
    options
  );

  /* eslint-enable */

  const loadPaths = [].concat(options.loadPaths);

  return Promise.all(
    loadPaths.map((loadPath) =>
      pglob(loadPath, {
        cwd: options.basePath,
      }).then((matchedPaths) =>
        matchedPaths.map((matchedPath) =>
          path.resolve(options.basePath, matchedPath, to)
        )
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
    });
};
