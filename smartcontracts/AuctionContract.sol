// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IHederaScheduleService {
    function authorizeSchedule(address schedule) external returns (int64 responseCode);
    function signSchedule(address schedule, bytes memory signatureMap) external returns (int64 responseCode);
    function createSchedule(
        address systemContractAddress,
        bytes memory callData,
        address payer
    ) external returns (int64 responseCode, address scheduleAddress);
}

contract AuctionContract {
    // Events
    event AuctionCreated(uint256 indexed auctionId, address indexed creator, uint256 endTime);
    event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 indexed auctionId, address indexed winner, uint256 winningBid);
    event FundsWithdrawn(uint256 indexed auctionId, address indexed bidder, uint256 amount);

    // Enums
    enum AuctionState { Created, Active, Ended }

    // Structs
    struct Auction {
        uint256 id;
        address creator;
        string title;
        uint256 endTime;
        uint256 reservePrice;
        address highestBidder;
        uint256 highestBid;
        AuctionState state;
    }

    // State variables
    uint256 public auctionCounter;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => mapping(address => uint256)) public bidderFunds;
    IHederaScheduleService public scheduleService;

    // Modifiers
    modifier auctionExists(uint256 _auctionId) {
        require(_auctionId <= auctionCounter && _auctionId > 0, "Auction does not exist");
        _;
    }

    modifier onlyCreator(uint256 _auctionId) {
        require(auctions[_auctionId].creator == msg.sender, "Only creator");
        _;
    }

    modifier auctionActive(uint256 _auctionId) {
        require(auctions[_auctionId].state == AuctionState.Active, "Auction not active");
        require(block.timestamp <= auctions[_auctionId].endTime, "Auction ended");
        _;
    }

    // Constructor
    constructor() {
        scheduleService = IHederaScheduleService(0x000000000000000000000000000000000000016B);
        auctionCounter = 0;
    }

    // Create an auction and schedule its end
    function createAuction(
        string calldata _title,
        uint256 _duration,
        uint256 _reservePrice
    ) external returns (uint256) {
        require(_duration > 0, "Duration must be greater than 0");
        require(_reservePrice > 0, "Reserve price must be greater than 0");

        auctionCounter++;
        uint256 newAuctionId = auctionCounter;

        uint256 endTime = block.timestamp + _duration;

        auctions[newAuctionId] = Auction({
            id: newAuctionId,
            creator: msg.sender,
            title: _title,
            endTime: endTime,
            reservePrice: _reservePrice,
            highestBidder: address(0),
            highestBid: 0,
            state: AuctionState.Active
        });

        // Encode the call to endAuction
        bytes memory callData = abi.encodeWithSignature("endAuction(uint256)", newAuctionId);

        // Schedule the endAuction transaction
        (int64 responseCode, address scheduleAddress) = scheduleService.createSchedule(
            address(this),
            callData,
            msg.sender
        );
        require(responseCode == 22, "Schedule creation failed"); // 22 is SUCCESS in Hedera

        // Authorize the schedule
        responseCode = scheduleService.authorizeSchedule(scheduleAddress);
        require(responseCode == 22, "Schedule authorization failed");

        emit AuctionCreated(newAuctionId, msg.sender, endTime);
        return newAuctionId;
    }

    // Place a bid
    function placeBid(uint256 _auctionId) external payable auctionExists(_auctionId) auctionActive(_auctionId) {
        Auction storage auction = auctions[_auctionId];
        uint256 newBid = bidderFunds[_auctionId][msg.sender] + msg.value;

        require(newBid > auction.highestBid, "Bid too low");
        require(newBid >= auction.reservePrice, "Bid below reserve price");

        bidderFunds[_auctionId][msg.sender] += msg.value;
        auction.highestBidder = msg.sender;
        auction.highestBid = newBid;

        emit BidPlaced(_auctionId, msg.sender, newBid);
    }

    // End the auction (called by scheduled transaction)
    function endAuction(uint256 _auctionId) external auctionExists(_auctionId) {
        Auction storage auction = auctions[_auctionId];
        require(auction.state == AuctionState.Active, "Auction not active");
        require(block.timestamp >= auction.endTime || msg.sender == address(scheduleService), "Auction not yet ended");

        auction.state = AuctionState.Ended;

        address winner = auction.highestBid >= auction.reservePrice ? auction.highestBidder : address(0);
        uint256 winningBid = winner != address(0) ? auction.highestBid : 0;

        emit AuctionEnded(_auctionId, winner, winningBid);
    }

    // Withdraw funds after auction ends
    function withdrawFunds(uint256 _auctionId) external auctionExists(_auctionId) {
        Auction storage auction = auctions[_auctionId];
        require(auction.state == AuctionState.Ended, "Auction not ended");

        uint256 amount = bidderFunds[_auctionId][msg.sender];
        require(amount > 0, "No funds to withdraw");

        // Prevent winner from withdrawing if reserve price met
        if (msg.sender == auction.highestBidder && auction.highestBid >= auction.reservePrice) {
            revert("Winner cannot withdraw");
        }

        bidderFunds[_auctionId][msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit FundsWithdrawn(_auctionId, msg.sender, amount);
    }

    // Withdraw winnings (for creator)
    function withdrawWinnings(uint256 _auctionId) external auctionExists(_auctionId) onlyCreator(_auctionId) {
        Auction storage auction = auctions[_auctionId];
        require(auction.state == AuctionState.Ended, "Auction not ended");
        require(auction.highestBid >= auction.reservePrice, "Reserve price not met");
        require(auction.highestBidder != address(0), "No valid winner");

        uint256 amount = auction.highestBid;
        auction.highestBid = 0; // Prevent double withdrawal

        payable(auction.creator).transfer(amount);
    }

    // View function to get auction details
    function getAuction(uint256 _auctionId) external view auctionExists(_auctionId) returns (Auction memory) {
        return auctions[_auctionId];
    }
}