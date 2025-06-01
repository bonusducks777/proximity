
import React, { useState } from 'react';
import { Wallet, Copy, ExternalLink, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const WalletPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress] = useState('0x742d35Cc6e3C2b5c9c5F4A2f6B7D8E9F1A2B3C4D');
  const [balance] = useState('2.4567');

  const transactions = [
    { id: '1', type: 'received', amount: '0.1234', from: 'crypto_dev', time: '2m ago' },
    { id: '2', type: 'sent', amount: '0.0567', to: 'blockchain_alice', time: '1h ago' },
    { id: '3', type: 'received', amount: '0.2890', from: 'web3_builder', time: '3h ago' },
  ];

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Web3 Wallet
        </h1>
        <p className="text-gray-400 text-sm">Connect your crypto wallet</p>
      </div>

      {!isConnected ? (
        /* Wallet Connection */
        <div className="space-y-6">
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center space-y-4">
            <Wallet className="w-16 h-16 text-blue-400 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Connect Wallet</h3>
              <p className="text-gray-400 text-sm">Connect your Web3 wallet to access blockchain features</p>
            </div>
            <button
              onClick={() => setIsConnected(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
            >
              Connect Wallet
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-medium">Supported Wallets</h4>
            {['MetaMask', 'WalletConnect', 'Coinbase Wallet'].map((wallet) => (
              <div key={wallet} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <span className="text-white">{wallet}</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Connected Wallet */
        <div className="space-y-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">{balance} ETH</div>
            <div className="text-green-400 text-sm">≈ $4,123.45 USD</div>
            
            <div className="flex items-center justify-center mt-4 space-x-2">
              <span className="text-gray-400 text-xs font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
              <button onClick={copyAddress} className="p-1">
                <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:border-blue-500/30 transition-all">
              <ArrowUpRight className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-white text-sm font-medium">Send</div>
            </button>
            <button className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:border-green-500/30 transition-all">
              <ArrowDownLeft className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-white text-sm font-medium">Receive</div>
            </button>
            <button className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:border-purple-500/30 transition-all">
              <Plus className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-white text-sm font-medium">Buy</div>
            </button>
          </div>

          {/* Recent Transactions */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Recent Transactions</h3>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${tx.type === 'received' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {tx.type === 'received' ? (
                          <ArrowDownLeft className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {tx.type === 'received' ? 'Received from' : 'Sent to'} {tx.type === 'received' ? tx.from : tx.to}
                        </div>
                        <div className="text-gray-400 text-xs">{tx.time}</div>
                      </div>
                    </div>
                    <div className={`font-mono ${tx.type === 'received' ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.type === 'received' ? '+' : '-'}{tx.amount} ETH
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
