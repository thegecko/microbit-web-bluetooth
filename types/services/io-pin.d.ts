/// <reference types="web-bluetooth" />
import { ServiceHelper } from "../service-helper";
import { TypedDispatcher } from "../event-dispatcher";
/**
 * @hidden
 */
export declare enum IoPinCharacteristic {
    pinData = "e95d8d00-251d-470a-a062-fa1922dfa9a8",
    pinAdConfiguration = "e95d5899-251d-470a-a062-fa1922dfa9a8",
    pinIoConfiguration = "e95db9fe-251d-470a-a062-fa1922dfa9a8",
    pwmControl = "e95dd822-251d-470a-a062-fa1922dfa9a8"
}
/**
 * Pin data
 */
export interface PinData {
    /**
     * Pin number
     */
    pin: number;
    /**
     * Pin value
     */
    value: number;
}
/**
 * PWM control data
 */
export interface PwmControlData {
    /**
     * Pin number
     */
    pin: number;
    /**
     * Pin value
     */
    value: number;
    /**
     * Period (in microseconds)
     */
    period: number;
}
/**
 * Analogue/Digital Enum
 */
export declare enum AD {
    Digital = 0,
    Analogue = 1
}
/**
 * Input/Output Enum
 */
export declare enum IO {
    Output = 0,
    Input = 1
}
/**
 * Events raised by the magnetometer service
 */
export interface IoPinEvents {
    /**
     * @hidden
     */
    newListener: keyof IoPinEvents;
    /**
     * @hidden
     */
    removeListener: keyof IoPinEvents;
    /**
     * Pin data changed event
     */
    pindatachanged: PinData[];
}
declare const IoPinService_base: new () => TypedDispatcher<IoPinEvents>;
/**
 * @hidden
 */
export declare class IoPinService extends IoPinService_base {
    /**
     * @hidden
     */
    static uuid: string;
    /**
     * @hidden
     */
    static create(service: BluetoothRemoteGATTService): Promise<IoPinService>;
    /**
     * @hidden
     */
    helper: ServiceHelper;
    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService);
    private init;
    /**
     * Read pin data
     */
    readPinData(): Promise<PinData[]>;
    /**
     * Write pin data
     * @param data The pin data to write
     */
    writePinData(data: PinData[]): Promise<void>;
    /**
     * Get pin analogue/digital configuration
     */
    getAdConfiguration(): Promise<AD[]>;
    /**
     * Set pin analogue/digital configuration
     * @param config The analogue/digital configuration to set
     */
    setAdConfiguration(config: AD[]): Promise<void>;
    /**
     * Get pin input/output configuration
     */
    getIoConfiguration(): Promise<IO[]>;
    /**
     * Set pin input/output configuration
     * @param config The input/output configuration to set
     */
    setIoConfiguration(config: IO[]): Promise<void>;
    /**
     * Set pin PWM control
     * @param data The PWM control data to set
     */
    setPwmControl(data: PwmControlData): Promise<void>;
    private pinDataChangedHandler;
    private dataViewToPinData;
    private pinDataToDataView;
    private dataViewToConfig;
    private configToDataView;
    private pwmControlDataToDataView;
}
export {};
