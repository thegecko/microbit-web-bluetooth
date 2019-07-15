/// <reference types="web-bluetooth" />
import { ServiceHelper } from "../service-helper";
/**
 * @hidden
 */
export declare enum DfuCharacteristic {
    dfuControl = "e95d93b1-251d-470a-a062-fa1922dfa9a8"
}
/**
 * @hidden
 */
export declare class DfuControlService {
    /**
     * @hidden
     */
    static uuid: string;
    /**
     * @hidden
     */
    static create(service: BluetoothRemoteGATTService): Promise<DfuControlService>;
    /**
     * @hidden
     */
    helper: ServiceHelper;
    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService);
    /**
     * Request device switches to DFU mode
     */
    requestDfu(): Promise<void>;
    /**
     * Request flash code
     */
    requestFlashCode(): Promise<void>;
}
