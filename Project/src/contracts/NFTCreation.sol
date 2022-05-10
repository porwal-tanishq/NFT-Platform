// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFTCreation is ERC721, ERC721Enumerable 
{
  address private burnAdd= 0x30B88D60A94eF82F589367700569d7445D5ACcB3;
  string[] public tokenURIs;
  mapping(string => bool) _tokenURIExists;
  mapping(uint => string) _tokenIdToTokenURI;

  constructor()
    ERC721("NFT Platform", "NFT")
  {
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) 
  {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) 
  {
    return super.supportsInterface(interfaceId);
  }

  function tokenURI(uint256 tokenId) public override view returns (string memory) 
  {
    require(_exists(tokenId), 'Token ID does not exist');
    return _tokenIdToTokenURI[tokenId];
  }

  function Mint(string memory _tokenURI) public 
  {
    require(!_tokenURIExists[_tokenURI], 'The NFT should be unique');
    tokenURIs.push(_tokenURI);
    uint _id = tokenURIs.length;
    _tokenIdToTokenURI[_id] = _tokenURI;
    _safeMint(msg.sender, _id);
    _tokenURIExists[_tokenURI] = true;
  }

   function burnNFT(uint256 tokenId) public
   {
    require(_exists(tokenId), 'NFT for this token ID does not exist');
    transferFrom(msg.sender,burnAdd,tokenId);
  }
} 