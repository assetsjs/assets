var WHITESPACE = /\s+/g;

module.exports = function (string) {
  return string
    .trim()
    .split('%').join('%25')
    .split('"').join('%22')
    .split('#').join('%23')
    .split('&').join('%26')
    .split('<').join('%3C')
    .split('>').join('%3E')
    .replace(WHITESPACE, ' ');
};
