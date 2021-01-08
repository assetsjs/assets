module.exports = (current, addon) => {
  if (current) {
    return `${current}&${addon}`;
  }
  return `?${addon}`;
};
