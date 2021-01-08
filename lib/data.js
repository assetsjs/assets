const extend = require("lodash/extend");
const fs = require("fs");
const mime = require("mime");
const Promise = require("bluebird");
const url = require("url");
const resolvePath = require("./path");
const encodeBuffer = require("./__utils__/encodeBuffer");

const preadFile = Promise.promisify(fs.readFile);

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

  const toUrl = url.parse(to);

  return resolvePath(toUrl.pathname, options)
    .then((resolvedPath) => {
      const mediaType = mime.getType(resolvedPath);
      return preadFile(resolvedPath).then((buffer) => {
        const content = encodeBuffer(buffer, mediaType);
        return `data:${mediaType};${content}${toUrl.hash || ""}`;
      });
    })
    .nodeify(callback);
};
