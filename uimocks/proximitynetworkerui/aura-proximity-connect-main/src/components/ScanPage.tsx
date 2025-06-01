
import React, { useState, useEffect } from 'react';
import { Scan, Radio, Users, Zap, UserCheck, Wifi } from 'lucide-react';

const ScanPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [nearbyDevices, setNearbyDevices] = useState([
    { id: '1', username: 'crypto_dev', address: '0x742d...4A2f', distance: '2m', mutual: true, online: true },
    { id: '2', username: 'blockchain_alice', address: '0x891c...7B9e', distance: '5m', mutual: false, online: true },
    { id: '3', username: 'web3_builder', address: '0x123a...9C4d', distance: '8m', mutual: true, online: false },
  ]);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false);
            return 0;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Proximity Scanner
        </h1>
        <p className="text-gray-400 text-xs">Discover nearby devices via Bluetooth LE</p>
      </div>

      {/* Scan Button */}
      <div className="flex justify-center">
        <button
          onClick={startScan}
          disabled={isScanning}
          className={`relative w-24 h-24 rounded-full border-4 border-blue-500/30 flex items-center justify-center transition-all duration-300 ${
            isScanning 
              ? 'bg-blue-500/20 scale-110 animate-pulse' 
              : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:scale-105 hover:border-blue-400/50'
          }`}
        >
          {isScanning ? (
            <>
              <Radio className="w-6 h-6 text-blue-400 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin"></div>
            </>
          ) : (
            <Scan className="w-6 h-6 text-blue-400" />
          )}
        </button>
      </div>

      {/* Scan Progress */}
      {isScanning && (
        <div className="space-y-2">
          <div className="w-full bg-gray-800/50 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-200"
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
          <p className="text-center text-xs text-gray-400">Scanning... {scanProgress}%</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
          <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{nearbyDevices.length}</div>
          <div className="text-xs text-gray-400">Found</div>
        </div>
        <div className="bg-black/20 backdrop-blur-sm border border-green-500/20 rounded-xl p-3 text-center">
          <UserCheck className="w-4 h-4 text-green-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-green-400">{nearbyDevices.filter(d => d.mutual).length}</div>
          <div className="text-xs text-green-400">Mutual</div>
        </div>
        <div className="bg-black/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-3 text-center">
          <Wifi className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-blue-400">{nearbyDevices.filter(d => d.online).length}</div>
          <div className="text-xs text-blue-400">Online</div>
        </div>
      </div>

      {/* Nearby Devices */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold text-sm">Nearby Devices</h3>
        <div className="space-y-2">
          {nearbyDevices.map((device) => (
            <div 
              key={device.id} 
              className={`backdrop-blur-sm border rounded-xl p-3 ${
                device.mutual 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-black/20 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      device.mutual 
                        ? 'bg-gradient-to-br from-green-500/30 to-blue-500/30' 
                        : 'bg-gradient-to-br from-blue-500/30 to-purple-500/30'
                    }`}>
                      <span className="text-white font-bold text-sm">
                        {device.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {device.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium text-sm">{device.username}</span>
                      {device.mutual && (
                        <UserCheck className="w-3 h-3 text-green-400" />
                      )}
                      {device.online && (
                        <Wifi className="w-3 h-3 text-blue-400" />
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">{device.address}</div>
                    <div className="text-xs text-blue-400">{device.distance} away</div>
                  </div>
                </div>
                <button className={`border rounded-lg px-3 py-1.5 text-xs transition-all ${
                  device.mutual
                    ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30'
                    : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-white hover:from-blue-500/30 hover:to-purple-500/30'
                }`}>
                  {device.mutual ? 'Connected' : 'Add Contact'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
