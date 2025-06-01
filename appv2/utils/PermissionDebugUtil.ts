// PermissionDebugUtil.ts - Utility to help debug permission issues
import { Platform, PermissionsAndroid } from 'react-native';
import { logger } from './LogUtil';

export const PermissionDebugUtil = {
  // Check all relevant permissions for the app and log their status
  async checkAllPermissions(): Promise<Record<string, string>> {
    logger.log('info', 'PermissionDebugUtil: Checking all permissions');
    
    if (Platform.OS !== 'android') {
      logger.log('info', 'PermissionDebugUtil: Not on Android, skipping permission check');
      return {};
    }
    
    // Define all permissions we're interested in
    const androidVersion = Platform.Version;
    const permissionList = [];
    
    // Add all permissions we want to check
    if (androidVersion >= 31) { // Android 12+
      permissionList.push(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
    } else {
      // Add legacy permissions for older Android versions
      permissionList.push(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      );
      
      // Add these manually since they might not be in the PermissionsAndroid constants
      if (!permissionList.includes('android.permission.BLUETOOTH')) {
        permissionList.push('android.permission.BLUETOOTH');
      }
      
      if (!permissionList.includes('android.permission.BLUETOOTH_ADMIN')) {
        permissionList.push('android.permission.BLUETOOTH_ADMIN');
      }
    }
    
    // Check permissions
    const results: Record<string, string> = {};
    
    for (const permission of permissionList) {
      try {
        // Only check if permission is in PermissionsAndroid.PERMISSIONS
        const knownPermissions = Object.values(PermissionsAndroid.PERMISSIONS);
        if (knownPermissions.includes(permission as any)) {
          const status = await PermissionsAndroid.check(permission as any);
          results[permission] = status ? 'GRANTED' : 'DENIED';
          logger.log('info', `PermissionDebugUtil: ${permission} - ${results[permission]}`);
        } else {
          results[permission] = 'NOT_CHECKABLE';
          logger.log('info', `PermissionDebugUtil: ${permission} - NOT_CHECKABLE`);
        }
      } catch (error) {
        results[permission] = `ERROR: ${error}`;
        logger.log('error', `PermissionDebugUtil: Error checking ${permission} - ${error}`);
      }
    }
    
    return results;
  },
  
  // Return a human-readable report of permission status
  async getPermissionReport(): Promise<string> {
    const permissions = await this.checkAllPermissions();
    let report = '===== PERMISSION REPORT =====\n';
    
    report += `Device: ${Platform.OS} ${Platform.Version}\n`;
    report += 'Permissions:\n';
    
    Object.entries(permissions).forEach(([permission, status]) => {
      report += `- ${permission}: ${status}\n`;
    });
    
    return report;
  }
};
