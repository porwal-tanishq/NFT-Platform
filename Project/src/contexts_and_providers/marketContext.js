import React from 'react';

const marketContext = React.createContext({
  contract: null,
  count: null,
  prices: [],
  buyerAmounts: null,
  marketIsLoading: true,
  loadContract: () => {},
  loadCount: () => {},
  loadPrices: () => {},
  updatePrice: () => {},
  addPrice: () => {},
  loadBuyerAmounts: () => {},
  setMarketIsLoading: () => {}
});

export default marketContext;