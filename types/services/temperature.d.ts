/// <reference types="web-bluetooth" />
import { TypedDispatcher } from "../event-dispatcher";
/**
 * @hidden
 */
export declare enum TemperatureCharacteristic {
    temperature = "e95d9250-251d-470a-a062-fa1922dfa9a8",
    temperaturePeriod = "e95d1b25-251d-470a-a062-fa1922dfa9a8"
}
/**
 * Events raised by the temperature service
 */
export interface TemperatureEvents {
    /**
     * @hidden
     */
    newListener: keyof TemperatureEvents;
    /**
     * @hidden
     */
    removeListener: keyof TemperatureEvents;
    /**
     * Temperature changed event
     */
    temperaturechanged: number;
}
declare const TemperatureService_base: new () => TypedDispatcher<TemperatureEvents>;
/**
 * Temperature Service
 */
export declare class TemperatureService extends TemperatureService_base {
    /**
     * @hidden
     */
    static uuid: string;
    /**
     * @hidden
     */
    static create(service: BluetoothRemoteGATTService): Promise<TemperatureService>;
    private helper;
    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService);
    private init;
    /**
     * Read temperature
     */
    readTemperature(): Promise<number>;
    /**
     * Get temperature sample period
     */
    getTemperaturePeriod(): Promise<number>;
    /**
     * Set temperature sample period
     * @param frequency The frequency to use (milliseconds)
     */
    setTemperaturePeriod(frequency: number): Promise<void>;
    private temperatureChangedHandler;
}
export {};
