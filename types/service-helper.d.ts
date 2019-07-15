/// <reference types="web-bluetooth" />
/// <reference types="node" />
import { EventEmitter } from "events";
/**
 * @hidden
 */
export interface ServiceEventHandler {
    characteristic: BluetoothCharacteristicUUID;
    handler: (event: Event) => void;
}
/**
 * @hidden
 */
export declare class ServiceHelper {
    private service;
    private emitter?;
    private static queue;
    private characteristics?;
    constructor(service: BluetoothRemoteGATTService, emitter?: EventEmitter | undefined);
    private getCharacteristic;
    getCharacteristicValue(uuid: BluetoothCharacteristicUUID): Promise<DataView>;
    setCharacteristicValue(uuid: BluetoothCharacteristicUUID, value: BufferSource): Promise<void>;
    handleListener(event: string, uuid: BluetoothCharacteristicUUID, handler: (event: Event) => void): Promise<void>;
}
