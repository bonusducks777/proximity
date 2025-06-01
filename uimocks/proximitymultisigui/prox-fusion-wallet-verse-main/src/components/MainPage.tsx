
import React from 'react';
import { Check, X, Settings } from 'lucide-react';

interface User {
  id: string;
  username: string;
  address: string;
  distance: number;
  added: boolean;
}

interface MainPageProps {
  members: User[];
  memberPresence: { [key: string]: boolean };
  onTogglePresence: (userId: string) => void;
}

const MainPage: React.FC<MainPageProps> = ({ members, memberPresence, onTogglePresence }) => {
  const presentMembers = members.filter(member => memberPresence[member.id]);
  const allPresent = members.length > 0 && presentMembers.length === members.length;
  
  return (
    <div className="p-4 space-y-6">
      {/* Multisig Status */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <div className="text-center">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            allPresent ? 'bg-green-500/20 animate-pulse' : 'bg-red-500/20'
          }`}>
            <div className={`w-12 h-12 rounded-full ${
              allPresent ? 'bg-green-500' : 'bg-red-500'
            } flex items-center justify-center`}>
              {allPresent ? <Check className="w-6 h-6 text-white" /> : <X className="w-6 h-6 text-white" />}
            </div>
          </div>
          
          <h2 className={`text-xl font-bold mb-2 ${
            allPresent ? 'text-green-400' : 'text-red-400'
          }`}>
            {allPresent ? 'Multisig Active' : 'Multisig Closed'}
          </h2>
          
          <p className="text-gray-400 text-sm">
            {allPresent 
              ? 'All members are within proximity range' 
              : `${presentMembers.length}/${members.length} members present`
            }
          </p>
        </div>
      </div>

      {/* Multisig Details */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Multisig Information</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Wallet Address:</span>
            <span className="text-white font-mono text-sm">0xAB12...CD34</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Required Signatures:</span>
            <span className="text-white">{Math.ceil(members.length * 0.6)}/{members.length}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Network:</span>
            <span className="text-purple-400">Ethereum Mainnet</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Balance:</span>
            <span className="text-green-400 font-bold">2.45 ETH</span>
          </div>
        </div>
      </div>

      {/* Member Presence Controls */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Member Presence (Demo Controls)</h3>
        
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
                  
                  <button
                    onClick={() => onTogglePresence(member.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isPresent
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    }`}
                  >
                    {isPresent ? 'Present' : 'Absent'}
                  </button>
                </div>
              </div>
            );
          })}
          
          {members.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No multisig wallet created yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
