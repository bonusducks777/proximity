
import React from 'react';
import { Check, X, Wallet, Settings } from 'lucide-react';

interface User {
  id: string;
  username: string;
  address: string;
  distance: number;
  added: boolean;
}

interface StatusPageProps {
  isInProximity: boolean;
  isWalletUnlocked: boolean;
  members: User[];
  memberPresence: { [key: string]: boolean };
}

const StatusPage: React.FC<StatusPageProps> = ({ 
  isInProximity, 
  isWalletUnlocked, 
  members, 
  memberPresence 
}) => {
  const presentMembers = members.filter(member => memberPresence[member.id]);
  
  return (
    <div className="p-4 space-y-6">
      {/* User Proximity Status */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">My Status</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${
                isInProximity ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <div>
                <div className="text-white font-medium">Proximity Status</div>
                <div className="text-sm text-gray-400">Connection to Proxhost</div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isInProximity 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {isInProximity ? 'In Proximity' : 'Out of Range'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Wallet className={`w-4 h-4 ${
                isWalletUnlocked ? 'text-green-400' : 'text-red-400'
              }`} />
              <div>
                <div className="text-white font-medium">Wallet Status</div>
                <div className="text-sm text-gray-400">Multisig accessibility</div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isWalletUnlocked 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {isWalletUnlocked ? 'Unlocked' : 'Locked'}
            </span>
          </div>
        </div>
      </div>

      {/* Multisig Overview */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Multisig Overview</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Wallet Address:</span>
            <span className="text-white font-mono text-sm">0xAB12...CD34</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Members Present:</span>
            <span className={`font-bold ${
              presentMembers.length === members.length ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {presentMembers.length}/{members.length}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Required Signatures:</span>
            <span className="text-purple-400">{Math.ceil(members.length * 0.6)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Your Role:</span>
            <span className="text-blue-400">Multisig Member</span>
          </div>
        </div>
      </div>

      {/* Member Status */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">
          Member Status ({presentMembers.length}/{members.length} present)
        </h3>
        
        <div className="space-y-3">
          {members.map(member => {
            const isPresent = memberPresence[member.id];
            
            return (
              <div key={member.id} className="p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      isPresent ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                    }`}></div>
                    
                    <div>
                      <div className="text-white font-medium">{member.username}</div>
                      <div className="text-sm text-gray-400">{member.address}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isPresent ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      isPresent ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isPresent ? 'Present' : 'Away'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {members.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              Not part of any multisig wallet
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            disabled={!isWalletUnlocked}
            className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Settings className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">Settings</div>
          </button>
          
          <button
            disabled={!isInProximity}
            className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wallet className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">View Wallet</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
