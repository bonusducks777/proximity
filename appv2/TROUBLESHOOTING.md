# Proximity App Troubleshooting Guide

This guide provides solutions for common issues with the Proximity App's device discovery features.

## Bluetooth Issues

### Bluetooth shows "searching" when actually off

If the app shows "Scanning" status when Bluetooth is actually turned off:

1. Toggle the Bluetooth switch off and back on
2. Check the actual Bluetooth status in your device settings
3. If Bluetooth is on but devices aren't being found, try restarting Bluetooth on your device
4. Use the "Debug Info" button on the Networker tab to see detailed status information
5. Use the "Check Permissions" button on the Bluetooth tab to verify that all required permissions are granted

### Permission issues

#### Android 12+ (API level 31+)
For Android 12 or newer devices, you need to grant these permissions:
- `BLUETOOTH_SCAN` - Required for discovering nearby devices
- `BLUETOOTH_CONNECT` - Required for connecting to discovered devices
- `ACCESS_FINE_LOCATION` - Required for Bluetooth scanning

#### Android 10-11 (API level 29-30) 
For Android 10-11 devices:
- `ACCESS_FINE_LOCATION` - Location permission is required for Bluetooth scanning
- The app manifest includes the legacy Bluetooth permissions that don't require runtime granting

#### All Android versions
If the app isn't working properly:

1. Go to **Settings > Apps > Proximity App > Permissions**
2. Ensure all location permissions are set to "Allow" or "Allow all the time" 
3. For Android 12+, make sure Nearby Devices permission is granted

#### Using the Permission Diagnostic Tool
The app includes a built-in permission diagnostic tool:

1. Go to the Bluetooth tab
2. Tap "Check Permissions" to see which permissions are granted or denied
3. For any denied permissions, open your device settings to grant them

## Wi-Fi Discovery Issues

Wi-Fi discovery uses multicast UDP packets, which may not work on all networks or devices.

### Common Wi-Fi Issues

1. **Network restrictions**: Many public Wi-Fi networks and some routers block multicast traffic for security reasons
2. **Device limitations**: Some devices have power-saving features that limit background networking
3. **Network isolation**: Some networks isolate devices from each other for security (often called "AP isolation" or "client isolation")
4. **VPN interference**: Active VPN connections can block or redirect multicast traffic
5. **Firewall settings**: Device firewalls might block UDP packets on port 55555

### Testing Wi-Fi Discovery

The app includes a built-in multicast testing tool that can diagnose network issues:

1. Tap the "Test Wi-Fi" button on the Networker tab
2. The test will try to send and receive a multicast message on your current network
3. The results will tell you if your device can send and receive multicast packets

#### If the test fails:

1. **Try a different network**: 
   - Connect to a different Wi-Fi network
   - Mobile hotspots often work better than corporate or public Wi-Fi

2. **Check for network restrictions**:
   - Create your own Wi-Fi hotspot from another device
   - Turn off any VPN or proxy services
   - Try disabling any firewall or security software temporarily

3. **Check router settings** (if it's your own network):
   - Log into your router admin panel
   - Look for settings like "AP isolation," "client isolation," or "multicast filtering"
   - Disable these features for testing

## General Troubleshooting

### Diagnostic Tools

The app includes several tools to help diagnose connection issues:

1. **Debug Info button**: Shows the current state of all connections and discovery services
2. **Check Permissions button**: Verifies that all required system permissions are granted
3. **Test Wi-Fi button**: Tests if your device and network support multicast messaging

### Basic Troubleshooting Steps

1. **Ensure devices are nearby**: Keep devices within close range (~10 meters) during testing
2. **Set a device name**: Make sure you've set a username before enabling discovery
3. **Verify both BLE and Wi-Fi**: Try enabling both to increase discovery chances
4. **Restart connectivity**: Toggle Bluetooth and Wi-Fi off and on in your device settings
5. **Update the app**: Make sure you're using the latest version
6. **Restart the app**: Force close and reopen the app if discovery features stop working
7. **Restart your device**: Some connectivity issues can be resolved with a device restart

## Device Discovery Between Phones

For two phones to discover each other:

1. Both phones must be running the app with discovery enabled
2. Both phones must have set a username
3. If using Bluetooth, both must have Bluetooth turned on and permissions granted
4. If using Wi-Fi, both must be on the same Wi-Fi network that allows multicast traffic

### Troubleshooting Cross-Device Discovery

If devices can't see each other:

1. **Verify both are properly configured**:
   - Check that both devices have unique usernames set
   - Verify both have the appropriate toggle enabled (BLE and/or Wi-Fi)
   - Check the status message to ensure both are actively scanning

2. **Test with Wi-Fi only or Bluetooth only**:
   - Try disabling one method and using only the other
   - If one works but not both, there may be a resource conflict

3. **Check for compatibility issues**:
   - Some older Android devices have limited BLE capabilities
   - Some Android skins (like MIUI, EMUI) have aggressive battery optimizations that can affect discovery
   - Open the app settings on your device and disable battery optimization for this app

## Reporting Issues

If issues persist after trying these solutions, please contact support with:
1. Your device model and OS version (e.g., "Samsung Galaxy S21, Android 12")
2. Screenshots of both the Debug Info and Permission Check results
3. Detailed description of which discovery methods are failing (BLE, Wi-Fi, or both)
4. Description of the network environment you're testing in
5. Steps you've already taken to try to resolve the issue
