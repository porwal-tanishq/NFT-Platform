import React, { useContext, useEffect } from 'react';

import web3 from './web3';
import Navbar from './DisplayWalletAddress';
import Main from './Main';
import Web3Context from './contexts_and_providers/web3Context';
import NFTContext from './contexts_and_providers/nftContext';
import MarketContext from './contexts_and_providers/marketContext'
import NFTCollection from './abis/NFTCreation.json';
import NFTMarket from './abis/NFTMarket.json';

const App = () => {
  const web3Ctx = useContext(Web3Context);
  const nftCtx = useContext(NFTContext);
  const marketCtx = useContext(MarketContext);
  
  useEffect(() => {
    if(!web3) 
    {
      window.alert('Non-Ethereum browser detected. You should install MetaMask Wallet first');
      return;
    }

    const loadBlockchainData = async() => 
    {
      try 
      {
        await window.ethereum.request({ method: 'eth_requestAccounts' });  
      } 
      catch(error) 
      {
        console.error(error);
      }
      const account = await web3Ctx.loadAccount(web3);
      const networkId = await web3Ctx.loadNetworkId(web3);    
      const nftCollectionDeployedNetwork = NFTCollection.networks[networkId];
      const nftCollectionContract = nftCtx.loadContract(web3, NFTCollection, nftCollectionDeployedNetwork);
      const nftMarketDeployedNetwork = NFTMarket.networks[networkId];
      const nftMarketContract = marketCtx.loadContract(web3, NFTMarket, nftMarketDeployedNetwork);
      
      if(nftCollectionContract) 
      {        
        const totalSupply = await nftCtx.loadTotalSupply(nftCollectionContract);
        nftCtx.loadCollection(nftCollectionContract, totalSupply);       

        nftCollectionContract.events.Transfer().on('data', (event) => {
          nftCtx.updateCollection(nftCollectionContract, event.returnValues.tokenId, event.returnValues.to);
          nftCtx.setNftIsLoading(false);
        }).on('error', (error) => {
          console.log(error);
        });
      }
      else 
      {
        window.alert('NFTCreation smart contract is not deployed on this network.')
      }

      if(nftMarketContract) 
      {
        const count = await marketCtx.loadCount(nftMarketContract);
        marketCtx.loadPrices(nftMarketContract, count); 
        account && marketCtx.loadBuyerAmounts(nftMarketContract, account);

        nftMarketContract.events.Sold().on('data', (event) => {
          marketCtx.updatePrice(event.returnValues.pid);
          nftCtx.updateOwner(event.returnValues.id, event.returnValues.newOwner);
          marketCtx.setMarketIsLoading(false);
        }).on('error', (error) => {
          console.log(error);
        });
 
        nftMarketContract.events.EnterPrice().on('data', (event) => {
          marketCtx.addPrice(event.returnValues);
          marketCtx.setMarketIsLoading(false);
        }).on('error', (error) => {
          console.log(error);
        });
 
        nftMarketContract.events.NFTRemovedFromListing().on('data', (event) => {
          marketCtx.updatePrice(event.returnValues.pid);
          nftCtx.updateOwner(event.returnValues.id, event.returnValues.owner);
          marketCtx.setMarketIsLoading(false);
        }).on('error', (error) => {
          console.log(error);
        });
      } 
      else 
      {
        window.alert('NFTMarket smart contract is not deployed on this network.')
      }

      nftCtx.setNftIsLoading(false);
      marketCtx.setMarketIsLoading(false);

      window.ethereum.on('accountsChanged', (accounts) => 
      {
        web3Ctx.loadAccount(web3);
        accounts[0] && marketCtx.loadBuyerAmounts(nftMarketContract, accounts[0]);
      });

      window.ethereum.on('chainChanged', (chainId) =>
      {
        window.location.reload();
      });
    };
    
    loadBlockchainData();
  }, []);

  const showNavbar = web3 && nftCtx.contract && marketCtx.contract;
  const showContent = web3 && nftCtx.contract && marketCtx.contract && web3Ctx.account;
  
  return(
    <div style={{backgroundColor:"black"}}>
    <React.Fragment>
      {showNavbar && <Navbar />}
      {showContent && <Main />}
    </React.Fragment>
    <footer>
            <div className="about">
                    <h3>About</h3>
                    <ul>
                        <li> <a href="About" id="noline"> About Us</a></li>
                        <li> <a href="Objectives" id="noline"> Objectives</a></li>
                    </ul>
            </div>
            <div className="mail">
                <h3>Mail Us</h3>
                <p>nftplatform@gmail.com</p><br></br>
            </div>
            <div className="office">
                <h3>Registered Office</h3>
                <p>Computer-Science Block,<br></br> 
                Medi-Caps University <br></br>
                <br></br>
                A.B. Road, Pigdamber, Rau <br></br>
                Indore - 453331</p>
                </div>
        </footer>
    </div>
  );
}

export default App;