// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract NFTAuction is IERC721Receiver 
{
    struct tokenDetails 
    {
        address seller;
        uint256 price;
        uint256 duration;
        uint256 maxBid;
        address maxBidder;
        bool isAuctionActive;
        uint256[] bidAmounts;
        address[] bidders;
    }

    mapping(address => mapping(uint256 => tokenDetails)) public tokenToAuction;
    mapping(address => mapping(uint256 => mapping(address => uint256))) public bids;
    
    function createAuction(address _nftCreation, uint256 _tokenId, uint256 _price, uint256 _duration) external 
    {
        require(msg.sender != address(0), "Invalid Address, This NFT is not owned by this account holder");
        require(_nftCreation != address(0), "NFT Creation contract address is invalid");
        require(_price > 0, "Auction Price should be more than 0 Ether");
        require(_duration > 0, "Auction Duration should be atleast 1 second");
        tokenDetails memory _auction = tokenDetails({
            seller: msg.sender,
            price: uint256(_price),
            duration: _duration,
            maxBid: 0,
            maxBidder: address(0),
            isAuctionActive: true,
            bidAmounts: new uint256[](0),
            bidders: new address[](0)
        });
        address owner = msg.sender;
        ERC721(_nftCreation).safeTransferFrom(owner, address(this), _tokenId); //temporary trasferring NFT from wallet to contract address
        tokenToAuction[_nftCreation][_tokenId] = _auction;
    }

    function bid(address _nftCreation, uint256 _tokenId) external payable 
    {
        tokenDetails storage auction = tokenToAuction[_nftCreation][_tokenId];
        require(msg.value >= auction.price, "Bid price is less than the current Auction price");
        require(auction.isAuctionActive, "Auction is not active");
        if (bids[_nftCreation][_tokenId][msg.sender] > 0) 
        {
            (bool success, ) = msg.sender.call{value: bids[_nftCreation][_tokenId][msg.sender]}("");
            require(success);
        }
        bids[_nftCreation][_tokenId][msg.sender] = msg.value;
        if (auction.bidAmounts.length == 0) 
        {
            auction.maxBid = msg.value;
            auction.maxBidder = msg.sender;
        } else 
        {
            uint256 lastIndex = auction.bidAmounts.length - 1;
            require(auction.bidAmounts[lastIndex] < msg.value, "Current bid price is higher than your bid price");
            auction.maxBid = msg.value;
            auction.maxBidder = msg.sender;
        }
        auction.bidders.push(msg.sender);
        auction.bidAmounts.push(msg.value);
    }

    function finishAuction(address _nftCreation, uint256 _tokenId) external 
    {
        tokenDetails storage auction = tokenToAuction[_nftCreation][_tokenId];
        require(auction.seller == msg.sender, "Auction should be ended by the owner who has started the auction");
        require(auction.isAuctionActive, "Auction is not active, Either it is already ended or cancelled by seller");
        auction.isAuctionActive = false;
        if (auction.bidAmounts.length == 0) 
        {
            ERC721(_nftCreation).safeTransferFrom(address(this), auction.seller, _tokenId);
        } 
        else 
        {
            (bool success, ) = auction.seller.call{value: auction.maxBid}("");
            require(success);
            for (uint256 i = 0; i < auction.bidders.length; i++) 
            {
                if (auction.bidders[i] != auction.maxBidder) 
                {
                    (success, ) = auction.bidders[i].call
                    {
                        value: bids[_nftCreation][_tokenId][auction.bidders[i]]
                    }("");
                    require(success);
                }
            }
            ERC721(_nftCreation).safeTransferFrom(address(this), auction.maxBidder, _tokenId);
        }
    }

    function cancelAuction(address _nftCreation, uint256 _tokenId) external 
    {
        tokenDetails storage auction = tokenToAuction[_nftCreation][_tokenId];
        require(auction.seller == msg.sender, "Auction should be ended by the owner who has started the auction");
        require(auction.isAuctionActive, "Auction is not active, Either it is already ended or cancelled by seller");
        auction.isAuctionActive = false;
        bool success;
        for (uint256 i = 0; i < auction.bidders.length; i++) 
        {
            (success, ) = auction.bidders[i].call{value: bids[_nftCreation][_tokenId][auction.bidders[i]]}("");        
            require(success);
        }
        ERC721(_nftCreation).safeTransferFrom(address(this), auction.seller, _tokenId);
    }

    function getAuctionDetails(address _nftCreation, uint256 _tokenId) public view returns (tokenDetails memory) 
    {
        tokenDetails memory auction = tokenToAuction[_nftCreation][_tokenId];
        return auction;
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data)external override returns(bytes4) 
    {
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }

    receive() external payable {}
}
