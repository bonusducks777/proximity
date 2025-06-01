
import React, { useState } from 'react';
import { User, Wallet, Copy, Edit, Plus, Shield, Globe } from 'lucide-react';

const AccountPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  
  const [profile] = useState({
    username: 'crypto_enthusiast',
    address: '0x742d35Cc6e3C2b5c9c5F4A2f6B7D8E9F1A2B3C4D',
    bio: 'Web3 developer & crypto enthusiast. Building the decentralized future.',
    verified: true,
    balance: '2.4567',
    totalConnections: 42,
    mutualConnections: 23
  });

  const copyAddress = () => {
    navigator.clipboard.writeText(profile.address);
  };

  const handleCreatePost = () => {
    console.log('Creating post:', postContent);
    setPostContent('');
    setShowCreatePost(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Account
        </h1>
        <p className="text-gray-400 text-xs">Wallet & Profile</p>
      </div>

      {!isConnected ? (
        /* Wallet Connection */
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center space-y-3">
          <Wallet className="w-12 h-12 text-blue-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Connect Wallet</h3>
            <p className="text-gray-400 text-xs">Connect your Web3 wallet to access features</p>
          </div>
          <button
            onClick={() => setIsConnected(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 text-sm"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Profile Card */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-4 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/40 to-purple-500/40 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <h2 className="text-lg font-bold text-white">{profile.username}</h2>
                {profile.verified && (
                  <Shield className="w-4 h-4 text-blue-400" />
                )}
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <span className="text-gray-400 text-xs font-mono">
                  {profile.address.slice(0, 6)}...{profile.address.slice(-4)}
                </span>
                <button onClick={copyAddress} className="p-1">
                  <Copy className="w-3 h-3 text-gray-400 hover:text-white" />
                </button>
              </div>
              
              <p className="text-gray-300 text-xs max-w-xs mx-auto">{profile.bio}</p>
              
              <div className="text-2xl font-bold text-white">{profile.balance} ETH</div>
              <div className="text-green-400 text-xs">≈ $4,123.45 USD</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-white">{profile.totalConnections}</div>
              <div className="text-xs text-gray-400">Total Connections</div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-white">{profile.mutualConnections}</div>
              <div className="text-xs text-gray-400">Mutual Contacts</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-3 text-white text-sm hover:from-blue-500/30 hover:to-purple-500/30 transition-all">
              <Edit className="w-4 h-4 mx-auto mb-1" />
              Edit Profile
            </button>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-3 text-white text-sm hover:from-green-500/30 hover:to-blue-500/30 transition-all"
            >
              <Plus className="w-4 h-4 mx-auto mb-1" />
              Create Post
            </button>
          </div>

          {/* Create Post Modal */}
          {showCreatePost && (
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-3">
              <h3 className="text-white font-medium text-sm">Create Post</h3>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm placeholder-gray-400 resize-none h-20 focus:outline-none focus:border-blue-500/50"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleCreatePost}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg text-sm hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  Post
                </button>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 bg-gray-600/20 border border-gray-500/30 text-white py-2 rounded-lg text-sm hover:bg-gray-600/30 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm">Settings</h3>
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-white font-medium text-sm">Public Profile</div>
                    <div className="text-xs text-gray-400">Allow others to view your profile</div>
                  </div>
                </div>
                <div className="w-10 h-5 rounded-full p-0.5 transition-all bg-blue-500">
                  <div className="w-4 h-4 bg-white rounded-full transition-all translate-x-5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
