// NetworkDiscovery.tsx
// Wi-Fi/UDP device discovery using react-native-udp
import { useEffect, useRef, useState } from 'react';
import dgram from 'react-native-udp';
import { logger } from '../utils/LogUtil';

const SERVICE_ID = '12345678-1234-5678-1234-567812345678';
const UDP_PORT = 55555;
const MULTICAST_ADDR = '239.255.255.250';

export function useNetworkDiscovery(deviceName: string = 'UserDevice', enabled: boolean = true) {
  const [devices, setDevices] = useState<{ id: string; name: string; lastSeen?: number; missedHeartbeats?: number; gray?: boolean }[]>([]);
  const [wifiAvailable, setWifiAvailable] = useState<boolean>(true);  // Start with true for better UX
  const socketRef = useRef<any>(null);
  const nameRef = useRef<string>(deviceName);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Define setupSocket function outside useEffect so it can be reused
  const setupSocket = async () => {
    logger.log('wifi', `NetworkDiscovery: setting up with name ${nameRef.current}`);
    
    // Check network connectivity by attempt to create socket
    try {
      // Always set WiFi available when we're attempting to use it - don't change this
      // unless we're absolutely sure WiFi is not available. This allows the toggle
      // to work properly regardless of the actual WiFi connection state
      setWifiAvailable(true);
      
      // Create the socket
      const socket = dgram.createSocket({ type: 'udp4' });
      socketRef.current = socket;
      
      // Set up error handling first to catch any issues
      socket.on('error', (err: Error | unknown) => {
        // Log the error but don't change wifiAvailable state
        // This ensures the UI remains consistent and toggle is not disabled
        logger.log('error', `NetworkDiscovery: Socket error: ${err}`);
      });
      
      socket.bind(UDP_PORT);
      socket.once('listening', () => {
        try {
          logger.log('wifi', 'NetworkDiscovery: socket listening, joining multicast group');
          socket.addMembership(MULTICAST_ADDR);
          setWifiAvailable(true);
          
          // Set up interval for periodic announcements (every 5 seconds)
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          
          intervalRef.current = setInterval(() => {
            broadcastPresence();
          }, 5000);
          
          // Initial broadcast
          broadcastPresence();
        } catch (err) {
          logger.log('error', `NetworkDiscovery: Failed to join multicast group: ${err}`);
          // Still mark as available for simple functionality
          // The multicast test will find more specific issues
          logger.log('wifi', 'NetworkDiscovery: Continuing with limited functionality');
        }
      });
        
      socket.on('message', (msg: Buffer, rinfo: { address: string }) => {
        try {
          const data = JSON.parse(msg.toString());
          
          // Handle test messages
          if (data.service === SERVICE_ID && data.test === true && data.testId) {
            logger.log('wifi', `NetworkDiscovery: received TEST message with ID ${data.testId}`);
            // Add test ID to devices temporarily so we can check if we received it
            setDevices((prev) => {
              if (!prev.find((d) => d.id === data.testId)) {
                return [...prev, { id: data.testId, name: 'SELF_TEST' }];
              }
              return prev;
            });
            return;
          }
          
          // Handle normal discovery messages
          if (data.service === SERVICE_ID && data.name !== nameRef.current) {
            logger.log('wifi', `NetworkDiscovery: received from ${data.name} (${rinfo.address})`);
            setDevices((prev) => {
              const idx = prev.findIndex((d) => d.id === rinfo.address);
              if (idx >= 0) {
                // Update lastSeen
                const updated = [...prev];
                updated[idx] = { ...updated[idx], lastSeen: Date.now(), name: data.name, missedHeartbeats: 0, gray: false };
                return updated;
              }
              return [...prev, { id: rinfo.address, name: data.name, lastSeen: Date.now(), missedHeartbeats: 0, gray: false }];
            });
          }
        } catch (err) {
          logger.log('error', `NetworkDiscovery: Error processing message: ${err}`);
        }
      });
    } catch (err) {
      logger.log('error', `NetworkDiscovery: Failed to create socket: ${err}`);
      // Don't set WiFi unavailable here - that would disable the toggle
      // We'll retry later
    }
  };

  // Function to broadcast presence
  const broadcastPresence = () => {
    if (!socketRef.current) {
      logger.log('wifi', 'NetworkDiscovery: Cannot broadcast - socket not initialized');
      // Attempt to recreate socket
      setupSocket();
      return;
    }
    
    const msg = JSON.stringify({ service: SERVICE_ID, name: nameRef.current });
    
    try {
      socketRef.current.send(msg, 0, msg.length, UDP_PORT, MULTICAST_ADDR);
      logger.log('wifi', `NetworkDiscovery: broadcast presence as ${nameRef.current}`);
    } catch (err) {
      logger.log('error', `NetworkDiscovery: Failed to send UDP packet: ${err}`);
      // Don't modify wifiAvailable here - let the user control when it's on/off
      
      // Add retry logic to handle temporary network issues
      setTimeout(() => {
        logger.log('wifi', 'NetworkDiscovery: Attempting to retry broadcast after failure');
        try {
          if (socketRef.current) {
            socketRef.current.send(msg, 0, msg.length, UDP_PORT, MULTICAST_ADDR);
            logger.log('wifi', 'NetworkDiscovery: Retry broadcast succeeded');
          }
        } catch (retryErr) {
          logger.log('error', `NetworkDiscovery: Retry failed: ${retryErr}`);
          // Try to recreate the socket if this keeps failing
          setupSocket();
        }
      }, 5000);
    }
  };
  // Check Wi-Fi status at startup and when it might have changed
  useEffect(() => {
    const checkWiFiStatus = async () => {
      try {
        // This is just a check to see if the network is available
        // We'll attempt to use the network regardless of this status
        logger.log('wifi', 'Networker: Checking Wi-Fi availability');
        
        if (!enabled) {
          logger.log('wifi', 'NetworkDiscovery: disabled by user');
          return;
        }
        
        // Regardless of actual Wi-Fi status, we'll try to set up the socket
        // and let the user control Wi-Fi discovery with the toggle
        setupSocket();
      } catch (err) {
        logger.log('error', `Networker: Wi-Fi is turned off: ${err}`);
      }
    };
    
    checkWiFiStatus();
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (socketRef.current) {
        logger.log('wifi', 'NetworkDiscovery: closing socket');
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [enabled]); // Only depend on enabled flag, not deviceName

  // Update the device name without recreating socket
  useEffect(() => {
    nameRef.current = deviceName;
    logger.log('wifi', `NetworkDiscovery: name updated to ${deviceName}`);
  }, [deviceName]);

  // Add a diagnostic function to test if we can receive our own multicast message
  const testMulticastConnectivity = () => {
    if (!socketRef.current) {
      logger.log('wifi', 'NetworkDiscovery: Cannot test multicast - socket not initialized');
      // Try to initialize the socket
      setupSocket();
      // Return a dummy test ID so UI doesn't crash
      return Math.random().toString(36).substring(2, 15);
    }
    
    // Send a special test message that we'll look for
    const testId = Math.random().toString(36).substring(2, 15);
    const testMsg = JSON.stringify({ 
      service: SERVICE_ID,
      name: nameRef.current,
      testId: testId,
      test: true
    });
    
    logger.log('wifi', `NetworkDiscovery: Testing multicast with ID ${testId}`);
    
    // Send the test message
    try {
      socketRef.current.send(testMsg, 0, testMsg.length, UDP_PORT, MULTICAST_ADDR);
      return testId; // Return the test ID so caller can check if we received it
    } catch (err) {
      logger.log('error', `NetworkDiscovery: Failed to send test packet: ${err}`);
      // Try to reinitialize socket
      setupSocket();
      return testId; // Return the ID anyway so UI can show diagnostic message
    }
  };

  // Timeout logic for device disappearance (Wi-Fi)
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev
        .map(d => {
          // If not seen in last 10s, remove
          if (d.lastSeen && Date.now() - d.lastSeen > 10000) return null;
          // If not seen in last 3*3s, increment missedHeartbeats
          const missed = d.lastSeen && Date.now() - d.lastSeen > 3000 ? (d.missedHeartbeats ?? 0) + 1 : 0;
          return {
            ...d,
            missedHeartbeats: missed,
            gray: missed >= 3 && (d.lastSeen && Date.now() - d.lastSeen < 10000) ? true : false
          };
        })
        .filter(d => d !== null)
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return { devices, wifiAvailable, testMulticastConnectivity };
}
