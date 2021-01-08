const extend = require("lodash/extend");

function Assets(options) {
  if (!(this instanceof Assets)) {
    return new Assets(options);
  }

  this.options = extend({}, options);
  Object.freeze(this);
}

["data", "path", "size", "url"].forEach((resolver) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  Assets[resolver] = require(`./${resolver}`);
  Assets.prototype[resolver] = (path, callback) =>
    Assets[resolver](path, this.options, callback);
});

module.exports = Assets;
