const toPercentage = (decimal: number): string => {
  return (decimal * 100).toFixed(2) + '%';
};

export {
  toPercentage
}