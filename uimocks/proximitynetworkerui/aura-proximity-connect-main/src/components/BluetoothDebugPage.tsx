
import React, { useState } from 'react';
import { Bluetooth, Wifi, Activity, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const BluetoothDebugPage = () => {
  const [isBluetoothOn, setIsBluetoothOn] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [connectionStatus] = useState('Connected');
  
  const debugInfo = [
    { label: 'Bluetooth Version', value: 'BLE 5.2', status: 'good' },
    { label: 'Signal Strength', value: '-45 dBm', status: 'good' },
    { label: 'Scan Interval', value: '10ms', status: 'good' },
    { label: 'Max Range', value: '100m', status: 'warning' },
    { label: 'Active Connections', value: '3/7', status: 'good' },
    { label: 'Battery Optimization', value: 'Enabled', status: 'good' },
  ];

  const connectedDevices = [
    { id: '1', name: 'iPhone 15 Pro', type: 'Phone', rssi: -42, status: 'connected' },
    { id: '2', name: 'MacBook Pro', type: 'Computer', rssi: -38, status: 'connected' },
    { id: '3', name: 'AirPods Pro', type: 'Audio', rssi: -55, status: 'connected' },
  ];

  const logs = [
    { time: '14:32:15', level: 'INFO', message: 'Bluetooth LE scan started' },
    { time: '14:32:12', level: 'SUCCESS', message: 'Connected to device: crypto_dev' },
    { time: '14:32:08', level: 'WARNING', message: 'Signal strength low for device: blockchain_alice' },
    { time: '14:32:05', level: 'INFO', message: 'Device discovered: web3_builder' },
    { time: '14:32:01', level: 'ERROR', message: 'Failed to connect to device: unknown_device' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'SUCCESS':
        return 'text-green-400';
      case 'WARNING':
        return 'text-yellow-400';
      case 'ERROR':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Bluetooth Debug
        </h1>
        <p className="text-gray-400 text-sm">System diagnostics and monitoring</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
          <Bluetooth className={`w-8 h-8 mx-auto mb-2 ${isBluetoothOn ? 'text-blue-400' : 'text-gray-400'}`} />
          <div className="text-white font-medium">Bluetooth</div>
          <div className={`text-xs ${isBluetoothOn ? 'text-green-400' : 'text-red-400'}`}>
            {isBluetoothOn ? 'Active' : 'Inactive'}
          </div>
        </div>
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
          <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-white font-medium">Status</div>
          <div className="text-xs text-green-400">{connectionStatus}</div>
        </div>
      </div>

      {/* Debug Information */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold">System Information</h3>
        <div className="space-y-2">
          {debugInfo.map((info, index) => (
            <div key={index} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{info.label}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm font-mono">{info.value}</span>
                  {info.status === 'good' && <CheckCircle className="w-4 h-4 text-green-400" />}
                  {info.status === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-400" />}
                  {info.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Devices */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Connected Devices</h3>
          <button
            onClick={() => setIsScanning(!isScanning)}
            className={`p-2 rounded-lg transition-all ${isScanning ? 'bg-blue-500/20 animate-pulse' : 'bg-black/20 hover:bg-blue-500/20'} border border-white/10`}
          >
            <RefreshCw className={`w-4 h-4 text-blue-400 ${isScanning ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="space-y-2">
          {connectedDevices.map((device) => (
            <div key={device.id} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{device.name}</div>
                  <div className="text-xs text-gray-400">{device.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-400">Connected</div>
                  <div className="text-xs text-gray-400">{device.rssi} dBm</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Logs */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold">Activity Logs</h3>
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 max-h-48 overflow-y-auto">
          <div className="space-y-2 font-mono text-xs">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="text-gray-500 shrink-0">{log.time}</span>
                <span className={`shrink-0 ${getLogColor(log.level)}`}>
                  [{log.level}]
                </span>
                <span className="text-gray-300">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 text-white hover:bg-blue-500/30 transition-all">
          Clear Logs
        </button>
        <button className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-3 text-white hover:bg-purple-500/30 transition-all">
          Export Data
        </button>
      </div>
    </div>
  );
};

export default BluetoothDebugPage;
