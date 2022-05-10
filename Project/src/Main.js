import { useContext  } from 'react';

import MintNFTForm from './MintNFT';
import NFTs from './NFTMarket';
import NFTContext from './contexts_and_providers/nftContext';
import MarketContext from './contexts_and_providers/marketContext';
import logo from './images/logo.png'

const Spinner = () => {
  return(
    <div className="text-center mt-5">
      <div className="spinner-border text-success text-center"></div>
    </div>
  );
};

const Main = () => {
  const nftCtx = useContext(NFTContext);
  const marketCtx = useContext(MarketContext);
  
  return(
    <div className="container-fluid mt-2 bg">
      <div className="row">
        <main role="main" className="col-lg-12 justify-content-center text-center">
          <div className="content mr-auto ml-auto">
            <img src={logo} alt="logo" width="500" height="140" className="mb-2"/>
            {!nftCtx.nftIsLoading && <MintNFTForm />}
            {nftCtx.nftIsLoading && <Spinner />}
          </div>
        </main>
      </div>
      <hr/>
      {!marketCtx.marketIsLoading && <NFTs />}
      {marketCtx.marketIsLoading && <Spinner />}
    </div>
  );
};

export default Main;