# Proximity App

A proximity-based networking app for peer discovery over Bluetooth and Wi-Fi.

## Features

- **Networker Tab**: Discover nearby devices using Bluetooth LE and Wi-Fi UDP multicast
- **Multisig Tab**: Create and manage multisignature transactions with discovered peers
- **Auction Tab**: Participate in local auctions with nearby peers
- **Bluetooth Tab**: Dedicated Bluetooth device management and diagnostics
- **Wallet Tab**: Manage cryptocurrency wallet integration

## Getting Started

### Prerequisites

- Android: 6.0 (Marshmallow) or higher
- Required permissions:
  - Location (required for BLE scanning on all Android versions)
  - Bluetooth scanning and connecting (for Android 12+)
  - Internet access (for Web3 features)

### Important Notes about Permissions

- **Android 12+**: The app will explicitly request Bluetooth and location permissions
- **All Android versions**: Location permission is required for Bluetooth device scanning
- Without proper permissions, discovery features will not work correctly

### Basic Usage

1. Open the app and go to the Networker tab
2. Enter your name and tap "Set Name"
3. Toggle on Bluetooth and/or Wi-Fi to start discovering nearby devices
4. Save contacts to interact with them in other tabs

## Troubleshooting

For common issues and solutions, please see the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide.

The app includes built-in diagnostic tools:
- Debug Info: View connection status details
- Permission Check: Verify required permissions are granted
- Wi-Fi Test: Check if your network supports multicast UDP
