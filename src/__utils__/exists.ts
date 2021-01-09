import fs from "fs";

export default (filePath, callback) => {
  fs.stat(filePath, (err) => {
    callback(null, err === null);
  });
};
