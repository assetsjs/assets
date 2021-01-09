import url from "url";
import composeAbsolutePathname from "./__utils__/composeAbsolutePathname";
import composeQueryString from "./__utils__/composeQueryString";
import composeRelativePathname from "./__utils__/composeRelativePathname";
import defaultCachebuster from "./__utils__/defaultCachebuster";
import resolvePath from "./path";
import { Options } from "./types";

export default (to: string, options: Options): Promise<any> => {
  const basePath = options.basePath || ".";
  const baseUrl = options.baseUrl || "/";
  const cachebuster =
    options.cachebuster === true ? defaultCachebuster : options.cachebuster;
  const relativeTo = options.relativeTo || false;

  const toUrl = url.parse(to);

  return resolvePath(decodeURI(toUrl.pathname!), options).then(
    (resolvedPath) => {
      let cachebusterOutput;

      if (relativeTo) {
        toUrl.pathname = composeRelativePathname(
          basePath,
          relativeTo,
          resolvedPath
        );
      } else {
        toUrl.pathname = composeAbsolutePathname(
          baseUrl,
          basePath,
          resolvedPath
        );
      }
      if (cachebuster) {
        cachebusterOutput = cachebuster(resolvedPath, toUrl.pathname);
        if (cachebusterOutput) {
          if (typeof cachebusterOutput !== "object") {
            toUrl.search = composeQueryString(
              toUrl.search!,
              String(cachebusterOutput)
            );
          } else {
            if (cachebusterOutput.pathname) {
              toUrl.pathname = cachebusterOutput.pathname;
            }
            if (cachebusterOutput.query) {
              toUrl.search = composeQueryString(
                toUrl.search!,
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
