const calipers = require("calipers")(
  require("calipers-webp"),
  require("calipers-png"),
  require("calipers-jpeg"),
  require("calipers-gif"),
  require("calipers-svg")
);
const Promise = require("bluebird");
const resolvePath = require("./path");

module.exports = (to, options, callback) => {
  /* eslint-disable no-param-reassign */

  if (typeof options === "function") {
    callback = options;
    options = {};
  }

  /* eslint-enable */

  return resolvePath(to, options)
    .then((resolvedPath) =>
      calipers
        .measure(resolvedPath)
        .then((result) => result.pages[0])
        .catch((err) =>
          Promise.reject(new Error(`${err.message}: ${resolvedPath}`))
        )
    )
    .nodeify(callback);
};
