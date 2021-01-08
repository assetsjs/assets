const path = require("path");
const convertPathToUrl = require("./convertPathToUrl");

module.exports = (basePath, relativeTo, resolvedPath) => {
  const from = path.resolve(basePath, relativeTo);
  const relativePath = path.relative(from, resolvedPath);
  return convertPathToUrl(relativePath);
};
