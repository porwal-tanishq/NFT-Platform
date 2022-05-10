import { useContext, useRef, createRef } from 'react';
import web3 from './web3';
import Web3Context from './contexts_and_providers/web3Context';
import NFTContext from './contexts_and_providers/nftContext';
import MarketContext from './contexts_and_providers/marketContext';
import eth from './images/eth.png';

const NFTCollection = () => {
  const web3Ctx = useContext(Web3Context);
  const nftCtx = useContext(NFTContext);
  const marketCtx = useContext(MarketContext);
  const priceRefs = useRef([]);
  if (priceRefs.current.length !== nftCtx.collection.length) 
  {
    priceRefs.current = Array(nftCtx.collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
  }

  const enterPriceHandler = (event, id, key, operation) => {
    event.preventDefault();
    if(operation==="Sell" || operation==="sell")
    {
      const enteredPrice = web3.utils.toWei(priceRefs.current[key].current.value, 'ether');
      nftCtx.contract.methods.approve(marketCtx.contract.options.address, id).send({ from: web3Ctx.account })
      .on('transactionHash', (hash) => {
        marketCtx.setMarketIsLoading(true);
      }).on('receipt', (receipt) => {      
        marketCtx.contract.methods.enterPrice(id, enteredPrice).send({ from: web3Ctx.account })
        .on('error', (error) => {
          window.alert('Error, Something went wrong');
          marketCtx.setMarketIsLoading(false);
        }); 
      });
    }
    else
    {
      nftCtx.contract.methods.burnNFT(id).send({from: web3Ctx.account})
      .on('receipt', (receipt) => {
        marketCtx.setMarketIsLoading(true);
      }).on('error', (error) => {
          window.alert('Error, Something went wrong');
          marketCtx.setMarketIsLoading(false);
        });
    }
  };

  const buyHandler = (event) => {    
    const buyIndex = parseInt(event.target.value);      
    marketCtx.contract.methods.buyNFT(marketCtx.prices[buyIndex].pid).send({ from: web3Ctx.account, value: marketCtx.prices[buyIndex].price })
    .on('transactionHash', (hash) => {
      marketCtx.setMarketIsLoading(true);
    })
    .on('error', (error) => {
      window.alert('Error, Something went wrong');
      marketCtx.setMarketIsLoading(false);
    });            
  };

  const removeListingHandler = (event) => {    
    const cancelIndex = parseInt(event.target.value);
    marketCtx.contract.methods.removeNFTFromListing(marketCtx.prices[cancelIndex].pid).send({ from: web3Ctx.account })
    .on('transactionHash', (hash) => {
      marketCtx.setMarketIsLoading(true);
    })
    .on('error', (error) => {
      window.alert('Error, Something went wrong');
      marketCtx.setMarketIsLoading(false);
    });    
  };

  const POWER = (10**18);
  const ether = (wei) =>wei / POWER;
  const formatPrice = (price) => 
  {
    const decimalPoint = 100;
    price = ether(price);
    price = Math.round(price * decimalPoint) / decimalPoint;
    return price;
  };

  return(
    <div className="row text-center">
      {nftCtx.collection.map((NFT, key) => {
        const index = marketCtx.prices ? marketCtx.prices.findIndex(price => price.id === NFT.id) : -1;
        const owner = index === -1 ? NFT.owner : marketCtx.prices[index].user;
        const price = index !== -1 ? formatPrice(marketCtx.prices[index].price).toFixed(2) : null;
        return(
          <div key={key} className="col-md-2 m-3 pb-3 card border-success">
            <div className={"card-body"}>       
              <h5 className="card-title">{NFT.title}</h5>
            </div>
            <img src={`https://ipfs.infura.io/ipfs/${NFT.img}`} className="card-img-bottom" alt={`NFT ${key}`} />                         
            <p className="fw-light fs-6">{`${owner.substr(0,7)}...${owner.substr(owner.length - 7)}`}</p>
            {index !== -1 ?
              owner !== web3Ctx.account ?
                <div className="row">
                  <div className="d-grid gap-2 col-5 mx-auto">
                    <button onClick={buyHandler} value={index} className="btn btn-success">Buy</button>
                  </div>
                  <div className="col-7 d-flex justify-content-end">
                    <img src={eth} width="25" height="25" className="align-center float-start" alt="price icon"></img>                
                    <p className="text-start"><b>{`${price}`}</b></p>
                  </div>
                </div> :
                <div className="row">
                  <div className="d-grid gap-2 col-5 mx-auto">
                    <button onClick={removeListingHandler} value={index} className="btn btn-danger">Cancel</button>
                  </div>
                  <div className="col-7 d-flex justify-content-end">
                    <img src={eth} width="25" height="25" className="align-center float-start" alt="price icon"></img>                
                    <p className="text-start"><b>{`${price}`}</b></p>
                  </div>
                </div> :
              owner === web3Ctx.account ?              
                <form className="row g-2" onSubmit={(e) => enterPriceHandler(e, NFT.id, key, document.getElementById("operation").value)}>                
                  <div className="col-3 d-grid gap-2">
                    <button type="submit" className="btn btn-primary">Enter</button>
                  </div>
                  <div className="col-4">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="ETH..."
                      className="form-control"
                      ref={priceRefs.current[key]}
                    />
                  </div>       
                  <div className="col-5 d-grid gap-2">
                    <input type="text" placeholder="Burn/Sell" id="operation" className="form-control" />
                  </div>                             
                </form> :
                <p><br/></p>}
          </div>
        );
      })}
    </div>
  );
};

export default NFTCollection;