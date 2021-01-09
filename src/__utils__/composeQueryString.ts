export default (current, addon) => {
  if (current) {
    return `${current}&${addon}`;
  }
  return `?${addon}`;
};
