const calipers = require("calipers")(
  require("calipers-webp"),
  require("calipers-png"),
  require("calipers-jpeg"),
  require("calipers-gif"),
  require("calipers-svg")
);
const resolvePath = require("./path");

module.exports = (to, options) =>
  resolvePath(to, options).then((resolvedPath) =>
    calipers
      .measure(resolvedPath)
      .then((result) => result.pages[0])
      .catch((err) =>
        Promise.reject(new Error(`${err.message}: ${resolvedPath}`))
      )
  );
