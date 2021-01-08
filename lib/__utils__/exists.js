const fs = require("fs");

module.exports = (filePath, callback) => {
  fs.stat(filePath, (err) => {
    callback(null, err === null);
  });
};
