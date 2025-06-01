
import React, { useState } from 'react';
import { Wallet, ArrowUp, ArrowDown, Lock } from 'lucide-react';

interface WalletPageProps {
  isMultisigActive: boolean;
}

const WalletPage: React.FC<WalletPageProps> = ({ isMultisigActive }) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const transactions = [
    { id: '1', type: 'received', amount: '1.2 ETH', from: '0x1234...5678', date: '2024-01-15' },
    { id: '2', type: 'sent', amount: '0.5 ETH', to: '0x9876...5432', date: '2024-01-14' },
    { id: '3', type: 'received', amount: '0.75 ETH', from: '0xABCD...EFGH', date: '2024-01-13' },
  ];

  const handleTransaction = () => {
    if (!isMultisigActive || !selectedAction || !amount) return;
    
    // Simulate transaction initiation
    alert(`Transaction initiated: ${selectedAction} ${amount} ETH`);
    setSelectedAction(null);
    setAmount('');
    setRecipient('');
  };

  return (
    <div className="p-4 space-y-6 relative">
      {/* Multisig Locked Overlay */}
      {!isMultisigActive && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
          <div className="text-center">
            <Lock className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-400 mb-2">Multisig Locked</h3>
            <p className="text-gray-400">All members must be present to access wallet</p>
          </div>
        </div>
      )}

      {/* Wallet Balance */}
      <div className={`bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 transition-all duration-300 ${
        !isMultisigActive ? 'opacity-30' : ''
      }`}>
        <div className="text-center">
          <Wallet className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">2.45 ETH</h2>
          <p className="text-gray-400">≈ $4,821.50 USD</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 transition-all duration-300 ${
        !isMultisigActive ? 'opacity-30' : ''
      }`}>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setSelectedAction('send')}
            disabled={!isMultisigActive}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              selectedAction === 'send'
                ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-purple-500/30'
            } disabled:cursor-not-allowed`}
          >
            <ArrowUp className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">Send</div>
          </button>
          
          <button
            onClick={() => setSelectedAction('receive')}
            disabled={!isMultisigActive}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              selectedAction === 'receive'
                ? 'bg-green-500/20 border-green-500 text-green-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-green-500/30'
            } disabled:cursor-not-allowed`}
          >
            <ArrowDown className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">Receive</div>
          </button>
        </div>

        {/* Transaction Form */}
        {selectedAction && isMultisigActive && (
          <div className="space-y-3 animate-fade-in">
            <input
              type="text"
              placeholder={selectedAction === 'send' ? 'Recipient address' : 'Your wallet address'}
              value={selectedAction === 'send' ? recipient : '0xAB12...CD34'}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={selectedAction === 'receive'}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
            
            <input
              type="text"
              placeholder="Amount in ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
            
            <button
              onClick={handleTransaction}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              {selectedAction === 'send' ? 'Initiate Transfer' : 'Generate QR Code'}
            </button>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className={`bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 transition-all duration-300 ${
        !isMultisigActive ? 'opacity-30' : ''
      }`}>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
        
        <div className="space-y-3">
          {transactions.map(tx => (
            <div key={tx.id} className="p-3 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {tx.type === 'received' ? (
                    <ArrowDown className="w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowUp className="w-4 h-4 text-red-400" />
                  )}
                  
                  <div>
                    <div className="text-white font-medium">{tx.amount}</div>
                    <div className="text-xs text-gray-400">
                      {tx.type === 'received' ? `From: ${tx.from}` : `To: ${tx.to}`}
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">{tx.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
