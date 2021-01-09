import path from "path";
import convertPathToUrl from "./convertPathToUrl";

export default (basePath, relativeTo, resolvedPath) => {
  const from = path.resolve(basePath, relativeTo);
  const relativePath = path.relative(from, resolvedPath);
  return convertPathToUrl(relativePath);
};
