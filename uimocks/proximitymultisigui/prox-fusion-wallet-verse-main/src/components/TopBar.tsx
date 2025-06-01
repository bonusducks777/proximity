
import React from 'react';
import { Settings } from 'lucide-react';

interface TopBarProps {
  mode: 'proxhost' | 'user';
  onModeToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ mode, onModeToggle }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="flex items-center justify-between px-4 py-3 max-w-sm mx-auto">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Proximity Multisig
        </h1>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="checkbox"
              checked={mode === 'user'}
              onChange={onModeToggle}
              className="sr-only"
            />
            <div
              onClick={onModeToggle}
              className={`w-16 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 ${
                mode === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${
                mode === 'user' ? 'translate-x-8' : ''
              }`} />
            </div>
          </div>
          
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      <div className="px-4 pb-2 max-w-sm mx-auto">
        <div className="text-xs text-center text-gray-400 font-medium">
          {mode === 'proxhost' ? 'Multisig Proxhost' : 'Multisig User'}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
