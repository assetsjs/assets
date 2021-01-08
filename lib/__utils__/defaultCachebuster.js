const fs = require("fs");

module.exports = (resolvedPath) => {
  const { mtime } = fs.statSync(resolvedPath);
  return mtime.getTime().toString(16);
};
