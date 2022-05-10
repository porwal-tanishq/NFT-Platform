import React from 'react';

const web3Context = React.createContext({
  account: null,
  networkId: null,
  loadAccount: () => {},
  loadNetworkId: () => {}
});

export default web3Context;