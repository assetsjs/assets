const { sep } = require("path");

module.exports = (path) => path.split(sep).join("/");
