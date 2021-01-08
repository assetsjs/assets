const path = require("path");
const url = require("url");
const convertPathToUrl = require("./convertPathToUrl");
const ensureTrailingSlash = require("./ensureTrailingSlash");

module.exports = (baseUrl, basePath, resolvedPath) => {
  const from = ensureTrailingSlash(baseUrl);
  const to = path.relative(basePath, resolvedPath);
  return url.resolve(from, convertPathToUrl(to));
};
