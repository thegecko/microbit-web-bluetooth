/// <reference types="web-bluetooth" />
/**
 * @hidden
 */
export declare enum DeviceInformationCharacteristic {
    modelNumber = "00002a24-0000-1000-8000-00805f9b34fb",
    serialNumber = "00002a25-0000-1000-8000-00805f9b34fb",
    firmwareRevision = "00002a26-0000-1000-8000-00805f9b34fb",
    hardwareRevision = "00002a27-0000-1000-8000-00805f9b34fb",
    manufacturer = "00002a29-0000-1000-8000-00805f9b34fb"
}
/**
 * Device information structure
 */
export interface DeviceInformation {
    /**
     * Model Number
     */
    modelNumber?: string;
    /**
     * Serial Number
     */
    serialNumber?: string;
    /**
     * Firmware Revision
     */
    firmwareRevision?: string;
    /**
     * Hardware Revision
     */
    hardwareRevision?: string;
    /**
     * Manufacturer Name
     */
    manufacturer?: string;
}
/**
 * Device Information Service
 */
export declare class DeviceInformationService {
    /**
     * @hidden
     */
    static uuid: string;
    /**
     * @hidden
     */
    static create(service: BluetoothRemoteGATTService): Promise<DeviceInformationService>;
    private helper;
    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService);
    /**
     * Read device information
     */
    readDeviceInformation(): Promise<DeviceInformation>;
    private readStringCharacteristic;
}
