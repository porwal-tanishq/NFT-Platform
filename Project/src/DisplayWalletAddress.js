import {useContext} from 'react';

import Web3Context from './contexts_and_providers/web3Context';

const Navbar = () => {
  const web3Ctx = useContext(Web3Context);
  
  let etherscanUrl='https://rinkeby.etherscan.io';

  return (
    <nav className="navbar navbar-expand-sm navbar-black bg-black p-2">      
      <ul className="navbar-nav ms-auto">
        <li className="nav-item p-2" style={{color:"white"}}>Wallet Address:</li>
        <li className="nav-item">
          {web3Ctx.account && 
          <a className="nav-link large" href={`${etherscanUrl}/address/${web3Ctx.account}`} target="blank" rel="noopener noreferrer">
          {web3Ctx.account}
          </a>}
        </li>
      </ul>
    </nav>
  );  
};

export default Navbar;