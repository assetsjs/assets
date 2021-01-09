import extend from "lodash/extend";
import url from "url";
import composeAbsolutePathname from "./__utils__/composeAbsolutePathname";
import composeQueryString from "./__utils__/composeQueryString";
import composeRelativePathname from "./__utils__/composeRelativePathname";
import defaultCachebuster from "./__utils__/defaultCachebuster";
import resolvePath from "./path";

export default (to, options): Promise<any> => {
  /* eslint-disable no-param-reassign */

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

  return resolvePath(decodeURI(toUrl.pathname!), options).then(
    (resolvedPath) => {
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
    }
  );
};
