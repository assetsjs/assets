export default (current: string | null, addon: string): string => {
  if (current) {
    return `${current}&${addon}`;
  }
  return `?${addon}`;
};
