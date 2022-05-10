const NFTCreation = artifacts.require("NFTCreation");
const NFTMarket = artifacts.require("NFTMarket");

module.exports = async function (deployer) 
{
  await deployer.deploy(NFTCreation);
  const deployingNFTCreation =  await NFTCreation.deployed();
  const NFTCreationAddress = deployingNFTCreation.address;
  console.log("Contract Address of NFTCreation Smart Contract: ", NFTCreationAddress);
  const deployingNFTMarket = await deployer.deploy(NFTMarket, NFTCreationAddress);
  const NFTMarketAddress = deployingNFTMarket.address;
  console.log("Contract Address of NFTMarket Smart Contract: ", NFTMarketAddress);
};