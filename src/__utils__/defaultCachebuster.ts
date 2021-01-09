import fs from "fs";

export default (resolvedPath: string): string => {
  const { mtime } = fs.statSync(resolvedPath);
  return mtime.getTime().toString(16);
};
