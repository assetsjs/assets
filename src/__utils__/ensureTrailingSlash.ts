import path from "path";
import url from "url";
import convertPathToUrl from "./convertPathToUrl";

export default (urlStr: string): string => {
  const urlObj = url.parse(urlStr);

  if (!urlObj.pathname) {
    throw new Error();
  }

  urlObj.pathname = convertPathToUrl(path.join(urlObj.pathname, path.sep));
  return url.format(urlObj);
};
