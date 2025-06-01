# 🌀 Proximity App

A new standard for **proximity-based interaction** in Web3.

Built at **ETHGlobal Prague 2025**, Proximity introduces a **real-world handshake protocol** that transforms how devices interact locally—without QR codes, servers, or web links. Powered by **BLE**, **Wi-Fi**, and custom **smart contracts** on Rootstock, Hedera, and Flow, we built the **Proximity App**, **Proximity Proof**, and the **Proximity Protocol** to make every physical interaction seamless, private, and on-chain.

> “You shouldn’t need to scan a QR code to prove you were there.”

---

## 🚀 What We Built

### 📱 Proximity App

A mobile app that discovers nearby peers over Bluetooth LE and Wi-Fi UDP multicast. It lets you:

* **Discover & save nearby devices** with zero friction
* **Launch multisig transactions** with people near you
* **Join location-gated auctions** only visible to local devices
* **Create a social graph** based on physical interactions

### 🎓 Proximity Proof

A lightweight way to prove device proximity in the real world:

* BLE + UDP packet exchange
* Timestamped local contact
* Privacy-respecting (no GPS, no PII)
* Used as a primitive for auctions, social graphs, multisig security

### ⚖️ Proximity Protocol

The overarching protocol that defines how devices:

* Discover and identify each other
* Exchange proximity proofs
* Share metadata (wallet, name, tag)
* Interact through smart contracts

Our long-term vision is to create an **open protocol standard** for secure, proximity-based interaction.

---

## 🔧 Features

### 🔍 Networker Tab

* Peer discovery via **Bluetooth LE** + **Wi-Fi multicast**
* Real-time peer list with presence timeout logic
* Tap to save and interact with trusted devices

### 🧩 Multisig Tab (Rootstock)

* Launch a multisig contract with nearby peers
* On-device co-signing using proximity proof
* Rootstock testnet deployment:
  `0x3Cf7c3E1Ff9aF6B5A720D09fB256DE5361f9D239`

### 🏢 Auction Tab (Hedera)

* Location-gated auctions only visible to nearby users
* Gasless bidding, fixed-fee logic using **Hedera Consensus Service**

### 🤝 Social Tab (Flow)

* Add IRL friends via verified proximity
* Mutuals and profiles backed by **Flow Cadence contracts**

### ⚙️ Bluetooth Tab

* Diagnose BLE status, permissions, advertising

### 💼 Wallet Tab

* WalletConnect + per-chain integrations (Rootstock, Hedera, Flow)

---

## 📈 Architecture

* **React Native** (Expo) + TypeScript frontend
* **BLE Advertising & Scanning** (react-native-ble-advertiser)
* **UDP Multicast** (react-native-udp)
* **Smart contract backends** on Rootstock, Hedera, Flow
* **UI mockups via WebViews** for fast prototyping
* **Dynamic mode switching**: mock vs real

---

## 🌐 Blockchain Integrations

| Chain     | Use Case                | Why It Was the Best Fit                    |
| --------- | ----------------------- | ------------------------------------------ |
| Rootstock | Proximity Multisig      | EVM-compatible, secure via PowHSMs         |
| Hedera    | Proximity Auctions      | Gasless, fast, fair, location-gated        |
| Flow      | Social Graphs / Friends | Scalable, low-cost, ideal for social logic |

---

## 🚫 No QR Codes, No Servers

QR codes are slow, spoofable, and require manual scanning. Servers add trust assumptions. Proximity uses **direct device-to-device protocols** with native APIs:

* Bluetooth LE advertising + scanning
* Wi-Fi UDP for fast peer broadcast
* Heartbeat detection for real-time presence

---

## 🤝 Get Started

### Requirements

* Android 6.0+ (BLE + multicast supported)
* Permissions: Location, Bluetooth, Network

### Usage

1. Open the app and go to **Networker Tab**
2. Set your name, enable Bluetooth/Wi-Fi
3. Nearby devices appear in real time
4. Save contacts to use them in **Multisig**, **Auction**, or **Social**

---

## 🚫 Troubleshooting

* Use the **Bluetooth Tab** to verify:

  * BLE status
  * Permissions (Location, Bluetooth)
  * Multicast availability
* More help in [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 🌟 Engineering Highlights

* Native BLE + UDP proximity stack in React Native
* Unified peer discovery layer (deduped across channels)
* Embedded WebView mock UIs that transition to native views
* Rapid prototyping: new tab = zipped HTML in `assets/ui-mocks/`
* BLE advertising lifecycle management across Android versions

---

## 🎥 Screenshots

> *(Insert screen captures of Networker tab, auction flow, and multisig signing)*

---

## 🏆 Built With

* ✨ React Native + TypeScript
* 🌐 Ethers.js, Hedera SDK, Flow JS SDK
* 🚀 BLE, UDP Multicast
* 💰 Rootstock, Hedera, Flow
* 👩‍💻 Built at **ETHGlobal Prague 2025**

---

## 👩‍💼 Team

* **Soumil Sahjpall** – Blockchain, AI & Web3 Engineer
* **Theo Abraham** – UX Designer & Copywriter

---

## 📅 Future Plans

* ZK mutual friend proofs
* IRL POAP check-ins & token drops
* BLE-based encrypted chat
* Proximity Protocol: Open Standard for IRL x Web3

---

**Proximity makes every physical interaction programmable.**

Join the movement – no QR codes, no servers, just presence.
