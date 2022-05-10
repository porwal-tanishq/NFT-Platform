import { useReducer } from 'react';

import Web3Context from './web3Context';

const defaultWeb3State = {
  account: null,
  networkId: null
};

const web3Reducer = (state, action) => {
  if(action.type === 'ACCOUNT') 
  {
    return {
      account: action.account,
      networkId: state.networkId
    };
  } 
  
  if(action.type === 'NETWORKID') 
  {
    return {
      account: state.account,
      networkId: action.networkId
    };
  }
  
  return defaultWeb3State;
};

const Web3Provider = props => {
  const [web3State, dispatchWeb3Action] = useReducer(web3Reducer, defaultWeb3State);
  
  const loadAccountHandler = async(web3) => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    const account = accounts[0];
    console.log(account)
    dispatchWeb3Action({type: 'ACCOUNT', account: account});
    return account;
  };

  const loadNetworkIdHandler = async(web3) => {
    const networkId = await web3.eth.net.getId();
    console.log(networkId);
    dispatchWeb3Action({type: 'NETWORKID', networkId: networkId});
    return networkId;   
  };
  
  const web3Context = {
    account:web3State.account,
    networkId: web3State.networkId,
    loadAccount: loadAccountHandler,
    loadNetworkId: loadNetworkIdHandler
  };
  
  return (
    <Web3Context.Provider value={web3Context}>
      {props.children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;