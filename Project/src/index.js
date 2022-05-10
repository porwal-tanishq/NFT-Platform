import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter} from 'react-router-dom';
import Web3Provider from './contexts_and_providers/web3Provider';
import NFTProvider from './contexts_and_providers/nftProvider';
import MarketProvider from './contexts_and_providers/marketProvider';
import App from './App.js';

ReactDOM.render(
  <BrowserRouter>
    <Web3Provider>
      <NFTProvider>
        <MarketProvider>
          <App />
        </MarketProvider>
      </NFTProvider>
    </Web3Provider>
  </BrowserRouter>,
  
  document.getElementById('root')
);