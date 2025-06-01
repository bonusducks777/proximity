// Type override for react-native-ble-advertiser

declare module 'react-native-ble-advertiser' {
  interface ScanOptions {
    allowDuplicates?: boolean;
    scanMode?: number;
    numberOfMatches?: number;
    matchMode?: number;
    matchNum?: number;
    reportDelay?: number;
    phy?: number;
  }

  const BLEAdvertiser: {
    scan(
      manufacturerData: number[] | null,
      options?: ScanOptions
    ): Promise<any>;
    scanByService(
      serviceUUID: string,
      options?: ScanOptions
    ): Promise<any>;
    broadcast(
      serviceUUID: string,
      manufacturerData: number[],
      options?: object
    ): Promise<any>;
    setCompanyId(companyId: number): Promise<void>;
    stopScan(): Promise<void>;
    stopBroadcast(): Promise<void>;
    // Static scan mode constants
    SCAN_MODE_LOW_LATENCY: number;
    SCAN_MODE_BALANCED: number;
    SCAN_MODE_LOW_POWER: number;
    // ...other methods
  };

  export default BLEAdvertiser;
}
