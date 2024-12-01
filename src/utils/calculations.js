export const calculateVatAmount = (cost, vatRate) => {
    return ((cost * vatRate) / 100).toFixed(2);
  };
  