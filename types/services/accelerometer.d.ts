/// <reference types="web-bluetooth" />
import { TypedDispatcher } from "../event-dispatcher";
/**
 * @hidden
 */
export declare enum AccelerometerCharacteristic {
    accelerometerData = "e95dca4b-251d-470a-a062-fa1922dfa9a8",
    accelerometerPeriod = "e95dfb24-251d-470a-a062-fa1922dfa9a8"
}
/**
 * Data received from the accelerometer
 */
export interface AccelerometerData {
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
 * The sample period to read accelerometer data (milliseconds)
 */
export declare type AccelerometerPeriod = 1 | 2 | 5 | 10 | 20 | 80 | 160 | 640;
/**
 * Events raised by the accelerometer service
 */
export interface AccelerometerEvents {
    /**
     * @hidden
     */
    newListener: keyof AccelerometerEvents;
    /**
     * @hidden
     */
    removeListener: keyof AccelerometerEvents;
    /**
     * Accelerometer data changed event
     */
    accelerometerdatachanged: AccelerometerData;
}
declare const AccelerometerService_base: new () => TypedDispatcher<AccelerometerEvents>;
/**
 * Accelerometer Service
 */
export declare class AccelerometerService extends AccelerometerService_base {
    /**
     * @hidden
     */
    static uuid: string;
    /**
     * @hidden
     */
    static create(service: BluetoothRemoteGATTService): Promise<AccelerometerService>;
    private helper;
    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService);
    private init;
    /**
     * Read acceleromter data
     */
    readAccelerometerData(): Promise<AccelerometerData>;
    /**
     * Get accelerometer sample period
     */
    getAccelerometerPeriod(): Promise<AccelerometerPeriod>;
    /**
     * Set accelerometer sample period
     * @param frequency The frequency interval to use
     */
    setAccelerometerPeriod(frequency: AccelerometerPeriod): Promise<void>;
    private accelerometerDataChangedHandler;
    private dataViewToAccelerometerData;
}
export {};
