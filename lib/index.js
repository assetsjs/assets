const extend = require("lodash/extend");
const resolveData = require("./data");
const resolvePath = require("./path");
const resolveSize = require("./size");
const resolveUrl = require("./url");

function Assets(options) {
  if (!(this instanceof Assets)) {
    return new Assets(options);
  }

  this.options = extend({}, options);
  Object.freeze(this);
}

Assets.prototype.data = function resolve(path) {
  return resolveData(path, this.options);
};

Assets.prototype.path = function resolve(path) {
  return resolvePath(path, this.options);
};

Assets.prototype.size = function resolve(path) {
  return resolveSize(path, this.options);
};

Assets.prototype.url = function resolve(path) {
  return resolveUrl(path, this.options);
};

module.exports = Assets;
