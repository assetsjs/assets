import path from "path";
import url from "url";

import convertPathToUrl from "./convertPathToUrl";
import ensureTrailingSlash from "./ensureTrailingSlash";

export default (
  baseURL: string,
  basePath: string,
  resolvedPath: string
): string => {
  const from = ensureTrailingSlash(baseURL);
  const to = path.relative(basePath, resolvedPath);
  return url.resolve(from, convertPathToUrl(to));
};
