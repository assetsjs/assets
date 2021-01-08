const path = require("path");
const url = require("url");
const convertPathToUrl = require("./convertPathToUrl");

module.exports = (urlStr) => {
  const urlObj = url.parse(urlStr);
  urlObj.pathname = convertPathToUrl(path.join(urlObj.pathname, path.sep));
  return url.format(urlObj);
};
