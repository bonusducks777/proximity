
import React from 'react';
import { Plus, Wallet, Settings, Book } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mode: 'proxhost' | 'user';
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, mode }) => {
  const proxhostTabs = [
    { id: 'create', label: 'Create', icon: Plus },
    { id: 'main', label: 'Main', icon: Settings },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'debug', label: 'Debug', icon: Book },
  ];

  const userTabs = [
    { id: 'status', label: 'Status', icon: Settings },
  ];

  const tabs = mode === 'proxhost' ? proxhostTabs : userTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-t border-white/20">
      <div className="flex justify-around items-center max-w-sm mx-auto px-4 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
