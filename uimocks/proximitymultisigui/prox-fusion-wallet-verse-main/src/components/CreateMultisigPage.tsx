
import React, { useState, useEffect } from 'react';
import { Plus, Check, Settings } from 'lucide-react';

interface User {
  id: string;
  username: string;
  address: string;
  distance: number;
  added: boolean;
}

interface CreateMultisigPageProps {
  onCreateMultisig: (members: User[]) => void;
}

const CreateMultisigPage: React.FC<CreateMultisigPageProps> = ({ onCreateMultisig }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedUsers, setDetectedUsers] = useState<User[]>([]);
  const [addedMembers, setAddedMembers] = useState<User[]>([]);

  const mockUsers: User[] = [
    { id: '1', username: 'CryptoAlice', address: '0x742d...8c3a', distance: 2.1, added: false },
    { id: '2', username: 'BlockBob', address: '0x1a2b...4f5e', distance: 1.8, added: false },
    { id: '3', username: 'EthereumEve', address: '0x9e8d...2c1b', distance: 3.2, added: false },
    { id: '4', username: 'DeFiDave', address: '0x6f4e...8a9b', distance: 1.5, added: false },
  ];

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        setDetectedUsers(prev => {
          if (prev.find(u => u.id === randomUser.id)) return prev;
          return [...prev, { ...randomUser, distance: Math.random() * 3 + 1 }];
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const startScanning = () => {
    setIsScanning(true);
    setDetectedUsers([]);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const addMember = (user: User) => {
    const updatedUser = { ...user, added: true };
    setAddedMembers(prev => [...prev, updatedUser]);
    setDetectedUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const removeMember = (userId: string) => {
    setAddedMembers(prev => prev.filter(u => u.id !== userId));
    setDetectedUsers(prev => prev.map(u => u.id === userId ? { ...u, added: false } : u));
  };

  const createMultisig = () => {
    if (addedMembers.length >= 2) {
      onCreateMultisig(addedMembers);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Scanning Controls */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">Proximity Detection</h2>
        
        <div className="flex gap-3 mb-4">
          <button
            onClick={startScanning}
            disabled={isScanning}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-medium disabled:opacity-50 transition-all duration-200 hover:shadow-lg"
          >
            {isScanning ? 'Scanning...' : 'Start Scan'}
          </button>
          
          <button
            onClick={stopScanning}
            disabled={!isScanning}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-xl font-medium disabled:opacity-50 transition-all duration-200 hover:shadow-lg"
          >
            Stop Scan
          </button>
        </div>
        
        {isScanning && (
          <div className="flex items-center justify-center text-blue-400">
            <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full mr-2"></div>
            Scanning for nearby devices...
          </div>
        )}
      </div>

      {/* Detected Users */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Detected Users ({detectedUsers.length})</h3>
        
        <div className="space-y-3">
          {detectedUsers.map(user => (
            <div key={user.id} className={`p-4 rounded-xl border transition-all duration-200 ${
              user.added 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-white/5 border-white/10 hover:border-purple-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-white font-medium">{user.username}</div>
                    {user.added && <Check className="w-4 h-4 text-green-400" />}
                  </div>
                  <div className="text-sm text-gray-400">{user.address}</div>
                  <div className="text-xs text-blue-400">{user.distance.toFixed(1)}m away</div>
                </div>
                
                <button
                  onClick={() => user.added ? removeMember(user.id) : addMember(user)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    user.added
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                  }`}
                >
                  {user.added ? 'Remove' : <Plus className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          
          {detectedUsers.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              {isScanning ? 'Searching for nearby users...' : 'Start scanning to detect nearby users'}
            </div>
          )}
        </div>
      </div>

      {/* Added Members */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Multisig Members ({addedMembers.length})</h3>
        
        <div className="space-y-3 mb-4">
          {addedMembers.map(member => (
            <div key={member.id} className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{member.username}</div>
                  <div className="text-sm text-gray-400">{member.address}</div>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={createMultisig}
          disabled={addedMembers.length < 2}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
        >
          Create Multisig Wallet ({addedMembers.length}/∞)
        </button>
        
        {addedMembers.length < 2 && (
          <div className="text-center text-gray-400 text-sm mt-2">
            Add at least 2 members to create a multisig wallet
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMultisigPage;
