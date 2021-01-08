const extend = require("lodash/extend");
const url = require("url");
const composeAbsolutePathname = require("./__utils__/composeAbsolutePathname");
const composeQueryString = require("./__utils__/composeQueryString");
const composeRelativePathname = require("./__utils__/composeRelativePathname");
const defaultCachebuster = require("./__utils__/defaultCachebuster");
const resolvePath = require("./path");

module.exports = (to, options, callback) => {
  /* eslint-disable no-param-reassign */

  if (typeof options === "function") {
    callback = options;
    options = {};
  }

  options = extend(
    {
      basePath: ".",
      baseUrl: "/",
      cachebuster: false,
      relativeTo: false,
    },
    options
  );

  if (options.cachebuster === true) {
    options.cachebuster = defaultCachebuster;
  }

  /* eslint-enable */

  const toUrl = url.parse(to);

  return resolvePath(decodeURI(toUrl.pathname), options)
    .then((resolvedPath) => {
      let cachebusterOutput;

      if (options.relativeTo) {
        toUrl.pathname = composeRelativePathname(
          options.basePath,
          options.relativeTo,
          resolvedPath
        );
      } else {
        toUrl.pathname = composeAbsolutePathname(
          options.baseUrl,
          options.basePath,
          resolvedPath
        );
      }
      if (options.cachebuster) {
        cachebusterOutput = options.cachebuster(resolvedPath, toUrl.pathname);
        if (cachebusterOutput) {
          if (typeof cachebusterOutput !== "object") {
            toUrl.search = composeQueryString(
              toUrl.search,
              String(cachebusterOutput)
            );
          } else {
            if (cachebusterOutput.pathname) {
              toUrl.pathname = cachebusterOutput.pathname;
            }
            if (cachebusterOutput.query) {
              toUrl.search = composeQueryString(
                toUrl.search,
                cachebusterOutput.query
              );
            }
          }
        }
      }
      return url.format(toUrl);
    })
    .nodeify(callback);
};
