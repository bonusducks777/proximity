
import React, { useState } from 'react';
import { User, Edit, Shield, Globe, Copy, QrCode } from 'lucide-react';

const ProfilePage = () => {
  const [profile] = useState({
    username: 'crypto_enthusiast',
    address: '0x742d35Cc6e3C2b5c9c5F4A2f6B7D8E9F1A2B3C4D',
    bio: 'Web3 developer & crypto enthusiast. Building the decentralized future.',
    verified: true,
    publicProfile: true,
    totalConnections: 42,
    mutualConnections: 23,
    joinedDate: 'March 2024'
  });

  const copyAddress = () => {
    navigator.clipboard.writeText(profile.address);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-gray-400 text-sm">Your blockchain identity</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500/40 to-purple-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <h2 className="text-xl font-bold text-white">{profile.username}</h2>
            {profile.verified && (
              <Shield className="w-5 h-5 text-blue-400" />
            )}
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gray-400 text-sm font-mono">
              {profile.address.slice(0, 6)}...{profile.address.slice(-4)}
            </span>
            <button onClick={copyAddress} className="p-1">
              <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          </div>
          
          <p className="text-gray-300 text-sm max-w-xs mx-auto">{profile.bio}</p>
        </div>

        <button className="mt-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg px-4 py-2 text-white text-sm hover:from-blue-500/30 hover:to-purple-500/30 transition-all">
          <Edit className="w-4 h-4 inline mr-2" />
          Edit Profile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{profile.totalConnections}</div>
          <div className="text-xs text-gray-400">Total Connections</div>
        </div>
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{profile.mutualConnections}</div>
          <div className="text-xs text-gray-400">Mutual Contacts</div>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold">Privacy Settings</h3>
        
        <div className="space-y-3">
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-white font-medium">Public Profile</div>
                  <div className="text-xs text-gray-400">Allow others to view your profile</div>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-all ${profile.publicProfile ? 'bg-blue-500' : 'bg-gray-600'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-all ${profile.publicProfile ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <QrCode className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-white font-medium">QR Code</div>
                  <div className="text-xs text-gray-400">Share your contact info</div>
                </div>
              </div>
              <button className="text-blue-400 text-sm hover:text-blue-300">
                View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <h4 className="text-white font-medium mb-3">Account Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Member since</span>
            <span className="text-white">{profile.joinedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Profile status</span>
            <span className="text-green-400">Verified</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Network</span>
            <span className="text-white">Ethereum Mainnet</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
