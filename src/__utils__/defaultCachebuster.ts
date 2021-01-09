import fs from "fs";

export default (resolvedPath) => {
  const { mtime } = fs.statSync(resolvedPath);
  return mtime.getTime().toString(16);
};
