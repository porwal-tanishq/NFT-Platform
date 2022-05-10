// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./NFTCreation.sol";

contract NFTMarket 
{
  uint public count;
  address private commission= 0x30B88D60A94eF82F589367700569d7445D5ACcB3;
  mapping (uint => _EnterPrice) public prices;
  mapping (address => uint) public buyerAmounts;
  NFTCreation nftCreation;

  struct _EnterPrice 
  {
    uint256 pid;
    uint256 id;
    address user;
    uint256 price;
    bool fulfilledAndTransferred;
    bool removedFromListing;
  }

  event EnterPrice(
    uint256 pid,
    uint256 id,
    address user,
    uint256 price,
    bool fulfilledAndTransferred,
    bool removedFromListing
  );

  event Sold(uint pid, uint id, address newOwner);
  event NFTRemovedFromListing(uint pid, uint id, address owner);

  constructor(address _nftCreation) 
  {
    nftCreation = NFTCreation(_nftCreation);
  }

  function enterPrice(uint _id, uint _price) public 
  {
    nftCreation.transferFrom(msg.sender, address(this), _id);
    count ++;
    prices[count] = _EnterPrice(count, _id, msg.sender, _price, false, false);
    emit EnterPrice(count, _id, msg.sender, _price, false, false);
  }

  function buyNFT(uint _pid) public payable 
  {
    _EnterPrice storage _nftPrice = prices[_pid];
    require(_nftPrice.pid == _pid, "NFT is not listed for sell");
    require(_nftPrice.user != msg.sender, "You are already the owner of the NFT");
    require(!_nftPrice.fulfilledAndTransferred, "NFT sold by owner, so it cannot be sold by same owner again");
    require(!_nftPrice.removedFromListing, "Owner has removed NFT from sell, so you cannot buy");
    require(msg.value == _nftPrice.price, "The buying amount does not match with the NFT Price");
    uint pft = (_nftPrice.price)* 20/100;
    address payable seller= payable(_nftPrice.user);
    seller.transfer(msg.value-pft);
    payable(commission).transfer(pft);
    nftCreation.transferFrom(address(this), msg.sender, _nftPrice.id);
    _nftPrice.fulfilledAndTransferred = true;
    emit Sold(_pid, _nftPrice.id, msg.sender);
  }

  function removeNFTFromListing(uint _pid) public 
  {
    _EnterPrice storage _nftPrice = prices[_pid];
    require(_nftPrice.pid == _pid, "NFT is not listed for sell");
    require(_nftPrice.user == msg.sender, "NFT can only be removed from sell by the owner");
    require(!_nftPrice.fulfilledAndTransferred, "NFT sold by owner, so it cannot be removed from sell by same owner again");
    require(!_nftPrice.removedFromListing, "NFT already removed from sell by the owner");
    nftCreation.transferFrom(address(this), msg.sender, _nftPrice.id);
    _nftPrice.removedFromListing = true;
    emit NFTRemovedFromListing(_pid, _nftPrice.id, msg.sender);
  }
  
  fallback () external 
  {
    revert();
  }
}