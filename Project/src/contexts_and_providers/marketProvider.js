import { useReducer } from 'react';

import MarketContext from './marketContext';

const defaultMarketState = {
  contract: null,
  count: null,
  prices: [],
  buyerAmounts: null,
  marketIsLoading: true
};

const marketReducer = (state, action) => {
  if(action.type === 'CONTRACT') 
  {    
    return {
      contract: action.contract,
      count: state.count,
      prices: state.prices,
      buyerAmounts: state.buyerAmounts,
      marketIsLoading: state.marketIsLoading
    };
  }

  if(action.type === 'LOADCOUNT') 
  {    
    return {
      contract: state.contract,
      count: action.count,
      prices: state.prices,
      buyerAmounts: state.buyerAmounts,
      marketIsLoading: state.marketIsLoading
    };
  }

  if(action.type === 'LOADPRICES') 
  {    
    return {
      contract: state.contract,
      count: state.count,
      prices: action.prices,
      buyerAmounts: state.buyerAmounts,
      marketIsLoading: state.marketIsLoading
    };
  }

  if(action.type === 'UPDATEPRICE') 
  {    
    const prices = state.prices.filter(price => price.pid !== parseInt(action.pid));
    return {
      contract: state.contract,
      count: state.count,
      prices: prices,
      buyerAmounts: state.buyerAmounts,
      marketIsLoading: state.marketIsLoading
    };
  }

  if(action.type === 'ADDPRICE') {    
    const index = state.prices.findIndex(price => price.pid === parseInt(action.price.pid));
    let prices = [];
    if(index === -1) 
    {
      prices = [...state.prices, 
      {
        pid: parseInt(action.price.pid),
        id: parseInt(action.price.id),
        user: (action.price.user),
        price: parseInt(action.price.price),
        fulfilledAndTransferred: false,
        removedFromListing: false
      }];
    } else 
    {
      prices = [...state.prices];
    }    

    return {
      contract: state.contract,
      count: state.count,
      prices: prices,
      buyerAmounts: state.buyerAmounts,
      marketIsLoading: state.marketIsLoading
    };
  }

  if(action.type === 'LOADING') 
  {    
    return {
      contract: state.contract,
      cunt: state.count,
      prices: state.prices,
      buyerAmounts: state.buyerAmounts,
      marketIsLoading: action.loading
    };
  }
  
  return defaultMarketState;
};

const MarketProvider = props => {
  const [MarketState, dispatchMarketAction] = useReducer(marketReducer, defaultMarketState);
  
  const loadContractHandler = (web3, NFTMarket, deployedNetwork) => {
    const contract = deployedNetwork ? new web3.eth.Contract(NFTMarket.abi, deployedNetwork.address): '';
    dispatchMarketAction({type: 'CONTRACT', contract: contract}); 
    return contract;
  };

  const loadCountHandler = async(contract) => {
    const count = await contract.methods.count().call();
    dispatchMarketAction({type: 'LOADCOUNT', count: count});
    return count;
  };

  const loadPricesHandler = async(contract, count) => {
    let prices = [];
    for(let i = 0; i < count; i++) {
      const price = await contract.methods.prices(i + 1).call();
      prices.push(price);
    }
    prices = prices.map(price => {
      price.pid = parseInt(price.pid);
      price.id = parseInt(price.id);
      price.price = parseInt(price.price);
      return price;
    }).filter(price => price.fulfilledAndTransferred === false && price.removedFromListing === false); 
    dispatchMarketAction({type: 'LOADPRICES', prices: prices});
  };

  const updatePriceHandler = (pid) => {
    dispatchMarketAction({type: 'UPDATEPRICE', pid: pid});   
  };

  const addPriceHandler = (price) => {
    dispatchMarketAction({type: 'ADDPRICE', price: price});   
  };

  const loadBuyerAmountsHandler = async(contract, account) => {
    const buyerAmounts = await contract.methods.buyerAmounts(account).call();
    dispatchMarketAction({type: 'LOADPRICES', buyerAmounts: buyerAmounts});
    return buyerAmounts;
  };

  const setMarketIsLoadingHandler = (loading) => {
    dispatchMarketAction({type: 'LOADING', loading: loading});
  };

  const marketContext = {
    contract: MarketState.contract,
    count: MarketState.count,
    prices: MarketState.prices,
    buyerAmounts: MarketState.buyerAmounts,
    marketIsLoading: MarketState.marketIsLoading,
    loadContract: loadContractHandler,
    loadCount: loadCountHandler,
    loadPrices: loadPricesHandler,
    updatePrice: updatePriceHandler,
    addPrice: addPriceHandler,
    loadBuyerAmounts: loadBuyerAmountsHandler,
    setMarketIsLoading: setMarketIsLoadingHandler
  };
  
  return (
    <MarketContext.Provider value={marketContext}>
      {props.children}
    </MarketContext.Provider>
  );
};

export default MarketProvider;