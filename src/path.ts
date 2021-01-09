import path from "path";
import util from "util";

import async from "async";
import glob from "glob";

import exists from "./__utils__/exists";
import { Options } from "./types";

const pglob = util.promisify(glob);
const emptyPaths: string[] = [];

export default (to: string, options: Options): Promise<string> => {
  const basePath = options.basePath || ".";
  const loadPaths = emptyPaths.concat(options.loadPaths || []);

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
    .then((filePaths) => emptyPaths.concat(...filePaths))
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
