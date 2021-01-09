import path from "path";
import url from "url";
import convertPathToUrl from "./convertPathToUrl";

export default (urlStr) => {
  const urlObj = url.parse(urlStr);
  urlObj.pathname = convertPathToUrl(path.join(urlObj.pathname!, path.sep));
  return url.format(urlObj);
};
