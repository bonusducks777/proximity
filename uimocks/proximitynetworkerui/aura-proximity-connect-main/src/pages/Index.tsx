
import React, { useState } from 'react';
import { Scan, Users, Wallet, User, Bluetooth, MessageSquare } from 'lucide-react';
import ScanPage from '../components/ScanPage';
import ContactsPage from '../components/ContactsPage';
import AccountPage from '../components/AccountPage';
import BluetoothDebugPage from '../components/BluetoothDebugPage';
import FeedPage from '../components/FeedPage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('feed');

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'feed':
        return <FeedPage />;
      case 'scan':
        return <ScanPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'account':
        return <AccountPage />;
      case 'debug':
        return <BluetoothDebugPage />;
      default:
        return <FeedPage />;
    }
  };

  const navItems = [
    { id: 'feed', icon: MessageSquare, label: 'Feed' },
    { id: 'scan', icon: Scan, label: 'Scan' },
    { id: 'contacts', icon: Users, label: 'Contacts' },
    { id: 'account', icon: User, label: 'Account' },
    { id: 'debug', icon: Bluetooth, label: 'Debug' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Mobile App Container with aspect ratio constraints */}
      <div className="max-w-sm mx-auto min-h-screen max-h-[calc(100vh)] flex flex-col relative overflow-hidden" style={{ aspectRatio: 'clamp(9/14, 9/21, 21/9)' }}>
        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
        
        {/* Top Bar */}
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 py-3 z-20">
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ProxNet
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Connected</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-3 pt-16 pb-20 relative z-10 overflow-y-auto">
          {renderActiveScreen()}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm z-20">
          <div className="bg-black/20 backdrop-blur-xl border-t border-white/10 px-2 py-2">
            <div className="flex justify-around items-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white scale-110'
                        : 'text-gray-400 hover:text-white hover:scale-105'
                    }`}
                  >
                    <Icon size={18} className="mb-1" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
