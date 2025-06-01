
import React, { useState, useEffect } from 'react';
import { Settings, Book } from 'lucide-react';

const DebugPage: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLogging, setIsLogging] = useState(false);

  const mockLogs = [
    'BLE scan started - searching for devices...',
    'Device discovered: iPhone (RSSI: -45 dBm)',
    'Device discovered: Galaxy S23 (RSSI: -52 dBm)',
    'Proximity calculation: 2.1m for device iPhone',
    'Proximity calculation: 1.8m for device Galaxy S23',
    'User authentication verified for CryptoAlice',
    'User authentication verified for BlockBob',
    'Multisig member list updated',
    'Connection established with 2/4 nearby devices',
  ];

  useEffect(() => {
    if (isLogging) {
      const interval = setInterval(() => {
        const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timestamp}] ${randomLog}`].slice(-20));
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isLogging]);

  const startLogging = () => {
    setIsLogging(true);
    setLogs([]);
  };

  const stopLogging = () => {
    setIsLogging(false);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Debug Controls */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Book className="w-5 h-5" />
          Proximity Debug Console
        </h2>
        
        <div className="flex gap-3 mb-4">
          <button
            onClick={startLogging}
            disabled={isLogging}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-medium disabled:opacity-50 transition-all duration-200 hover:shadow-lg"
          >
            {isLogging ? 'Logging...' : 'Start Debug'}
          </button>
          
          <button
            onClick={stopLogging}
            disabled={!isLogging}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-medium disabled:opacity-50 transition-all duration-200 hover:shadow-lg"
          >
            Stop Debug
          </button>
          
          <button
            onClick={clearLogs}
            className="px-4 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-all duration-200"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Proximity Stats */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Proximity Statistics</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-xl">
            <div className="text-2xl font-bold text-blue-400">4</div>
            <div className="text-sm text-gray-400">Devices Detected</div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl">
            <div className="text-2xl font-bold text-green-400">2</div>
            <div className="text-sm text-gray-400">Authenticated Users</div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl">
            <div className="text-2xl font-bold text-purple-400">1.8m</div>
            <div className="text-sm text-gray-400">Avg Distance</div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl">
            <div className="text-2xl font-bold text-yellow-400">-48</div>
            <div className="text-sm text-gray-400">Avg RSSI (dBm)</div>
          </div>
        </div>
      </div>

      {/* Debug Console */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Live Debug Output</h3>
        
        <div className="bg-black/50 rounded-xl p-4 h-64 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No debug logs yet. Start debugging to see live output.
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-green-400 mb-1 animate-fade-in">
                {log}
              </div>
            ))
          )}
          
          {isLogging && (
            <div className="text-yellow-400 animate-pulse">
              ▋ Listening for proximity events...
            </div>
          )}
        </div>
      </div>

      {/* Device Settings */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Detection Settings
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Maximum Detection Range</label>
            <input
              type="range"
              min="1"
              max="10"
              defaultValue="5"
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-xs text-gray-400 mt-1">5 meters</div>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">Scan Interval</label>
            <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none">
              <option value="1">1 second</option>
              <option value="2" selected>2 seconds</option>
              <option value="5">5 seconds</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Auto-refresh proximity</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" defaultChecked />
              <div className="w-12 h-6 bg-purple-500 rounded-full p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full shadow-lg transform translate-x-6 transition-transform"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
