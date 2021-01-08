const extend = require("lodash/extend");
const fsPromises = require("fs").promises;
const mime = require("mime");
const url = require("url");
const resolvePath = require("./path");
const encodeBuffer = require("./__utils__/encodeBuffer");

module.exports = (to, options) => {
  /* eslint-disable no-param-reassign */

  options = extend(
    {
      basePath: ".",
      loadPaths: [],
    },
    options
  );

  /* eslint-enable */

  const toUrl = url.parse(to);

  return resolvePath(toUrl.pathname, options).then((resolvedPath) => {
    const mediaType = mime.getType(resolvedPath);
    return fsPromises.readFile(resolvedPath).then((buffer) => {
      const content = encodeBuffer(buffer, mediaType);
      return `data:${mediaType};${content}${toUrl.hash || ""}`;
    });
  });
};
