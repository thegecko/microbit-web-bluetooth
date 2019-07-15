/// <reference types="web-bluetooth" />
import { TypedDispatcher } from "../event-dispatcher";
/**
 * @hidden
 */
export declare enum MagnetometerCharacteristic {
    magnetometerData = "e95dfb11-251d-470a-a062-fa1922dfa9a8",
    magnetometerPeriod = "e95d386c-251d-470a-a062-fa1922dfa9a8",
    magnetometerBearing = "e95d9715-251d-470a-a062-fa1922dfa9a8",
    magnetometerCalibration = "e95db358-251d-470a-a062-fa1922dfa9a8"
}
/**
 * Data received from the magnetometer
 */
export interface MagnetometerData {
    /**
     * Force in direction X
     */
    x: number;
    /**
     * Force in direction Y
     */
    y: number;
    /**
     * Force in direction Z
     */
    z: number;
}
/**
 * Magnetometer calibation state
 */
export declare enum MagnetometerCalibration {
    /**
     * Unknown state
     */
    unknown = 0,
    /**
     * Calibration has been requestes
     */
    requested = 1,
    /**
     * Calibration completed
     */
    completed = 2,
    /**
     * Calibration had an error
     */
    errored = 3
}
/**
 * The sample period to read magnetometer data (milliseconds)
 */
export declare type MagnetometerPeriod = 1 | 2 | 5 | 10 | 20 | 80 | 160 | 640;
/**
 * Events raised by the magnetometer service
 */
export interface MagnetometerEvents {
    /**
     * @hidden
     */
    newListener: keyof MagnetometerEvents;
    /**
     * @hidden
     */
    removeListener: keyof MagnetometerEvents;
    /**
     * Magnetometer data changed event
     */
    magnetometerdatachanged: MagnetometerData;
    /**
     * Magnetometer bearing changed event
     */
    magnetometerbearingchanged: number;
    /**
     * Magnetometer calibration changed event
     */
    magnetometercalibrationchanged: MagnetometerCalibration;
}
declare const MagnetometerService_base: new () => TypedDispatcher<MagnetometerEvents>;
/**
 * Magnetometer Service
 */
export declare class MagnetometerService extends MagnetometerService_base {
    /**
     * @hidden
     */
    static uuid: string;
    /**
     * @hidden
     */
    static create(service: BluetoothRemoteGATTService): Promise<MagnetometerService>;
    private helper;
    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService);
    private init;
    /**
     * Request magnetometer calibration
     */
    calibrate(): Promise<void>;
    /**
     * Read magnetometer data
     */
    readMagnetometerData(): Promise<MagnetometerData>;
    /**
     * Read magnetometer bearing
     */
    readMagnetometerBearing(): Promise<number | undefined>;
    /**
     * Get magnetometer sample period
     */
    getMagnetometerPeriod(): Promise<MagnetometerPeriod>;
    /**
     * Set magnetometer sample period
     * @param frequency The frequency interval to use
     */
    setMagnetometerPeriod(frequency: MagnetometerPeriod): Promise<void>;
    private magnetometerDataChangedHandler;
    private magnetometerBearingChangedHandler;
    private magnetometerCalibrationChangedHandler;
    private dataViewToMagnetometerData;
}
export {};
