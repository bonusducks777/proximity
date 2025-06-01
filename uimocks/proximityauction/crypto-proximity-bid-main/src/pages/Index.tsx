// Update this page (the content is just a fallback if you fail to update the page)

import React, { useState, useEffect } from 'react';
import { Search, Plus, Wallet, Settings, Circle, Users, Clock, Zap, Signal, Lock, Unlock, TrendingUp, Eye, Settings2 } from 'lucide-react';

const Index = () => {
  const [mode, setMode] = useState('proxhost'); // 'proxhost' or 'user'
  const [currentPage, setCurrentPage] = useState('main');
  const [auctionStatus, setAuctionStatus] = useState('closed'); // 'active' or 'closed'
  const [eligibleBidders, setEligibleBidders] = useState([]);
  const [detectedUsers, setDetectedUsers] = useState([
    { id: 1, username: "CryptoTrader_87", address: "0x1234...5678", present: true, signal: 85 },
    { id: 2, username: "NFTCollector", address: "0x9abc...def0", present: false, signal: 32 },
    { id: 3, username: "BlockchainBob", address: "0x4567...1234", present: true, signal: 92 },
    { id: 4, username: "DigitalDave", address: "0x7890...abcd", present: true, signal: 78 },
  ]);
  const [userInProximity, setUserInProximity] = useState(true);
  const [userAuthorized, setUserAuthorized] = useState(true);
  const [currentBid, setCurrentBid] = useState(2.5);
  const [userBidAmount, setUserBidAmount] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(3672); // seconds
  const [auctionItem, setAuctionItem] = useState({
    name: "Rare Digital Collectible #1337",
    description: "Limited edition NFT with unique blockchain provenance",
    minBid: 1.0,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop"
  });

  // Timer effect
  useEffect(() => {
    if (auctionStatus === 'active' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [auctionStatus, timeRemaining]);

  // Check auction status based on bidder presence
  useEffect(() => {
    const allPresent = eligibleBidders.length > 0 && eligibleBidders.every(bidder => 
      detectedUsers.find(user => user.id === bidder.id)?.present
    );
    setAuctionStatus(allPresent ? 'active' : 'closed');
  }, [eligibleBidders, detectedUsers]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addToBidders = (user) => {
    if (!eligibleBidders.find(bidder => bidder.id === user.id)) {
      setEligibleBidders([...eligibleBidders, user]);
    }
  };

  const removeBidder = (userId) => {
    setEligibleBidders(eligibleBidders.filter(bidder => bidder.id !== userId));
  };

  const toggleUserPresence = (userId) => {
    setDetectedUsers(detectedUsers.map(user => 
      user.id === userId ? { ...user, present: !user.present } : user
    ));
  };

  const placeBid = () => {
    const bidValue = parseFloat(userBidAmount);
    if (bidValue > currentBid) {
      setCurrentBid(bidValue);
      setUserBidAmount('');
      // Add animation effect here
    }
  };

  // Top Bar Component
  const TopBar = () => (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-lg border-b border-purple-500/20">
      <div className="flex items-center justify-between p-4 max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Proximity Auction
          </h1>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800/50 rounded-full p-1">
          <button
            onClick={() => setMode('proxhost')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              mode === 'proxhost' 
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Proxhost
          </button>
          <button
            onClick={() => setMode('user')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              mode === 'user' 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            User
          </button>
        </div>
      </div>
    </div>
  );

  // Bottom Navigation
  const BottomNav = () => {
    const proxhostNavItems = [
      { id: 'create', icon: Plus, label: 'Create' },
      { id: 'main', icon: Circle, label: 'Main' },
      { id: 'wallet', icon: Wallet, label: 'Wallet' },
      { id: 'debug', icon: Settings, label: 'Debug' },
    ];

    const userNavItems = [
      { id: 'status', icon: TrendingUp, label: 'Status' },
    ];

    const navItems = mode === 'proxhost' ? proxhostNavItems : userNavItems;

    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-slate-900/95 via-slate-800/95 to-transparent backdrop-blur-lg border-t border-purple-500/20">
        <div className="flex justify-around items-center p-2 max-w-md mx-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
                currentPage === item.id
                  ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400 shadow-lg'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Create Auction Page (Proxhost)
  const CreateAuctionPage = () => (
    <div className="space-y-6">
      {/* Auction Item Setup */}
      <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Eye className="w-5 h-5 text-purple-400" />
          <span>Auction Item</span>
        </h2>
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl overflow-hidden">
            <img 
              src={auctionItem.image} 
              alt="Auction Item" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <input 
              type="text" 
              value={auctionItem.name}
              onChange={(e) => setAuctionItem({...auctionItem, name: e.target.value})}
              className="w-full bg-slate-700/50 text-white rounded-lg px-4 py-3 border border-purple-500/20 focus:border-purple-400 focus:outline-none"
              placeholder="Item name"
            />
          </div>
          <div>
            <input 
              type="number" 
              value={auctionItem.minBid}
              onChange={(e) => setAuctionItem({...auctionItem, minBid: parseFloat(e.target.value)})}
              className="w-full bg-slate-700/50 text-white rounded-lg px-4 py-3 border border-purple-500/20 focus:border-purple-400 focus:outline-none"
              placeholder="Minimum bid (ETH)"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {/* Proximity Detection */}
      <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Search className="w-5 h-5 text-blue-400" />
          <span>Nearby Users</span>
        </h2>
        <div className="space-y-3">
          {detectedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/20">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${user.present ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400'}`} />
                <div>
                  <p className="text-white font-medium">{user.username}</p>
                  <p className="text-gray-400 text-sm">{user.address}</p>
                  <p className="text-xs text-gray-500">Signal: {user.signal}%</p>
                </div>
              </div>
              <button
                onClick={() => addToBidders(user)}
                disabled={eligibleBidders.find(bidder => bidder.id === user.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  eligibleBidders.find(bidder => bidder.id === user.id)
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25'
                }`}
              >
                {eligibleBidders.find(bidder => bidder.id === user.id) ? 'Added' : 'Add'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Eligible Bidders */}
      {eligibleBidders.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/50 to-green-900/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-400" />
            <span>Eligible Bidders ({eligibleBidders.length})</span>
          </h2>
          <div className="space-y-2">
            {eligibleBidders.map((bidder) => (
              <div key={bidder.id} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <span className="text-white">{bidder.username}</span>
                <button
                  onClick={() => removeBidder(bidder.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Auction Button */}
      <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-4 rounded-2xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all transform hover:scale-105">
        Create Auction
      </button>
    </div>
  );

  // Main Page (Proxhost)
  const MainPage = () => (
    <div className="space-y-6">
      {/* Auction Status */}
      <div className={`bg-gradient-to-br backdrop-blur-lg rounded-2xl p-6 border ${
        auctionStatus === 'active' 
          ? 'from-green-800/50 to-emerald-900/20 border-green-500/20' 
          : 'from-red-800/50 to-rose-900/20 border-red-500/20'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Auction Status</h2>
          <div className={`px-4 py-2 rounded-full font-medium ${
            auctionStatus === 'active' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {auctionStatus === 'active' ? 'Active' : 'Closed'}
          </div>
        </div>
        
        {auctionStatus === 'active' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="text-white font-mono text-lg">{formatTime(timeRemaining)}</span>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">Current Highest Bid</p>
              <p className="text-2xl font-bold text-white">{currentBid} ETH</p>
            </div>
          </div>
        )}
      </div>

      {/* Bidder Presence Status */}
      <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
        <h2 className="text-xl font-bold text-white mb-4">Bidder Presence</h2>
        <div className="space-y-3">
          {eligibleBidders.map((bidder) => {
            const user = detectedUsers.find(u => u.id === bidder.id);
            return (
              <div key={bidder.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${user?.present ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  <span className="text-white">{bidder.username}</span>
                </div>
                <button
                  onClick={() => toggleUserPresence(bidder.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    user?.present 
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {user?.present ? 'Set Away' : 'Set Present'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-xl p-4 border border-blue-500/20 text-white font-medium">
          View Bids
        </button>
        <button className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20 text-white font-medium">
          End Auction
        </button>
      </div>
    </div>
  );

  // Wallet Page (Proxhost)
  const WalletPage = () => (
    <div className="space-y-6">
      <div className={`relative bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 ${
        auctionStatus === 'closed' ? 'opacity-50' : ''
      }`}>
        {auctionStatus === 'closed' && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="text-center">
              <Lock className="w-12 h-12 text-red-400 mx-auto mb-2" />
              <p className="text-red-400 font-bold">Auction Locked</p>
              <p className="text-gray-400 text-sm">Wallet unavailable when auction is closed</p>
            </div>
          </div>
        )}
        
        <h2 className="text-xl font-bold text-white mb-6">Auction Wallet</h2>
        
        <div className="space-y-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-gray-300 text-sm">Total Escrow</p>
            <p className="text-2xl font-bold text-white">{currentBid * eligibleBidders.length} ETH</p>
          </div>
          
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-gray-300 text-sm">Pending Distribution</p>
            <p className="text-xl font-bold text-green-400">{currentBid} ETH</p>
          </div>
          
          <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 rounded-lg">
            Distribute Funds
          </button>
          
          <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-lg">
            View Transaction History
          </button>
        </div>
      </div>
    </div>
  );

  // Debug Page (Proxhost)
  const DebugPage = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-800/50 to-orange-900/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Settings2 className="w-5 h-5 text-orange-400" />
          <span>Proximity Debug</span>
        </h2>
        
        <div className="space-y-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Detection Range</h3>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">5m</span>
              <div className="flex-1 bg-slate-600 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full w-3/4"></div>
              </div>
              <span className="text-gray-400 text-sm">50m</span>
            </div>
          </div>
          
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Signal Strength</h3>
            {detectedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2">
                <span className="text-gray-300 text-sm">{user.username}</span>
                <div className="flex items-center space-x-2">
                  <Signal className={`w-4 h-4 ${user.signal > 70 ? 'text-green-400' : user.signal > 40 ? 'text-yellow-400' : 'text-red-400'}`} />
                  <span className="text-white text-sm">{user.signal}%</span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-lg">
            Refresh Detection
          </button>
        </div>
      </div>
    </div>
  );

  // Status Page (User)
  const StatusPage = () => (
    <div className="space-y-6">
      {/* User Status */}
      <div className={`bg-gradient-to-br backdrop-blur-lg rounded-2xl p-6 border ${
        userInProximity && userAuthorized 
          ? 'from-green-800/50 to-emerald-900/20 border-green-500/20' 
          : 'from-red-800/50 to-rose-900/20 border-red-500/20'
      }`}>
        <h2 className="text-xl font-bold text-white mb-4">Connection Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white">Proximity</span>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              userInProximity ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${userInProximity ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm font-medium">{userInProximity ? 'In Range' : 'Out of Range'}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white">Authorization</span>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              userAuthorized ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {userAuthorized ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              <span className="text-sm font-medium">{userAuthorized ? 'Authorized' : 'Unauthorized'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Details */}
      <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
        <h2 className="text-xl font-bold text-white mb-4">Auction Details</h2>
        <div className="space-y-4">
          <div className="aspect-video bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg overflow-hidden">
            <img 
              src={auctionItem.image} 
              alt="Auction Item" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-white font-medium">{auctionItem.name}</h3>
            <p className="text-gray-400 text-sm">{auctionItem.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <p className="text-gray-400 text-xs">Current Bid</p>
              <p className="text-white font-bold">{currentBid} ETH</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <p className="text-gray-400 text-xs">Time Left</p>
              <p className="text-white font-bold font-mono">{formatTime(timeRemaining)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bidding Interface */}
      <div className={`relative bg-gradient-to-br from-slate-800/50 to-blue-900/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20 ${
        !userInProximity || !userAuthorized ? 'opacity-50' : ''
      }`}>
        {(!userInProximity || !userAuthorized) && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="text-center">
              <Lock className="w-12 h-12 text-red-400 mx-auto mb-2" />
              <p className="text-red-400 font-bold">Bidding Locked</p>
              <p className="text-gray-400 text-sm">
                {!userInProximity ? 'Move closer to auction' : 'Not authorized to bid'}
              </p>
            </div>
          </div>
        )}
        
        <h2 className="text-xl font-bold text-white mb-4">Place Bid</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Bid Amount (ETH)</label>
            <input
              type="number"
              value={userBidAmount}
              onChange={(e) => setUserBidAmount(e.target.value)}
              className="w-full bg-slate-700/50 text-white rounded-lg px-4 py-3 border border-blue-500/20 focus:border-blue-400 focus:outline-none"
              placeholder={`Minimum: ${currentBid + 0.1} ETH`}
              step="0.1"
            />
          </div>
          <button
            onClick={placeBid}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:scale-105"
          >
            Place Bid
          </button>
        </div>
      </div>

      {/* Other Bidders */}
      <div className="bg-gradient-to-br from-slate-800/50 to-green-900/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20">
        <h2 className="text-xl font-bold text-white mb-4">Other Bidders</h2>
        <div className="space-y-2">
          {eligibleBidders.map((bidder) => {
            const user = detectedUsers.find(u => u.id === bidder.id);
            return (
              <div key={bidder.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${user?.present ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  <span className="text-white">{bidder.username}</span>
                </div>
                <span className={`text-sm ${user?.present ? 'text-green-400' : 'text-red-400'}`}>
                  {user?.present ? 'Present' : 'Away'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setUserInProximity(!userInProximity)}
          className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-xl p-4 border border-orange-500/20 text-white font-medium"
        >
          Toggle Proximity
        </button>
        <button 
          onClick={() => setUserAuthorized(!userAuthorized)}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20 text-white font-medium"
        >
          Toggle Auth
        </button>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    if (mode === 'proxhost') {
      switch (currentPage) {
        case 'create': return <CreateAuctionPage />;
        case 'main': return <MainPage />;
        case 'wallet': return <WalletPage />;
        case 'debug': return <DebugPage />;
        default: return <MainPage />;
      }
    } else {
      return <StatusPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <TopBar />
      
      <div className="pt-20 pb-24 px-4 max-w-md mx-auto relative z-10">
        {renderCurrentPage()}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Index;
