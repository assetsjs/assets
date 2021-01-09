import async from "async";
import flatten from "lodash/flatten";
import glob from "glob";
import path from "path";
import util from "util";
import exists from "./__utils__/exists";
import { Options } from "./types";

const pglob = util.promisify(glob);

export default (to: string, options: Options): Promise<string> => {
  const basePath = options.basePath || ".";
  const loadPaths = ([] as string[]).concat(options.loadPaths || []);

  return Promise.all(
    loadPaths.map((loadPath) =>
      pglob(loadPath, {
        cwd: basePath,
      }).then((matchedPaths) =>
        matchedPaths.map((matchedPath) =>
          path.resolve(basePath, matchedPath, to)
        )
      )
    )
  )
    .then((filePaths) => flatten(filePaths))
    .then((filePaths) => {
      filePaths.unshift(path.resolve(basePath, to));

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
