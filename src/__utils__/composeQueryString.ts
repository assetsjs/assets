export default (current: string, addon: string): string => {
  if (current) {
    return `${current}&${addon}`;
  }
  return `?${addon}`;
};
