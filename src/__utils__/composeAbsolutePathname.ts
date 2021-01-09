import path from "path";
import url from "url";
import convertPathToUrl from "./convertPathToUrl";
import ensureTrailingSlash from "./ensureTrailingSlash";

export default (baseUrl, basePath, resolvedPath) => {
  const from = ensureTrailingSlash(baseUrl);
  const to = path.relative(basePath, resolvedPath);
  return url.resolve(from, convertPathToUrl(to));
};
