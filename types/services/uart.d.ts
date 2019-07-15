/// <reference types="web-bluetooth" />
import { TypedDispatcher } from "../event-dispatcher";
/**
 * @hidden
 */
export declare enum UartCharacteristic {
    tx = "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
    rx = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
}
/**
 * Events raised by the UART service
 */
export interface UartEvents {
    /**
     * @hidden
     */
    newListener: keyof UartEvents;
    /**
     * @hidden
     */
    removeListener: keyof UartEvents;
    /**
     * Serial data received event
     */
    receive: Uint8Array;
    /**
     * Serial received text event
     */
    receiveText: string;
}
declare const UartService_base: new () => TypedDispatcher<UartEvents>;
/**
 * UART Service
 */
export declare class UartService extends UartService_base {
    /**
     * @hidden
     */
    static uuid: string;
    /**
     * @hidden
     */
    static create(service: BluetoothRemoteGATTService): Promise<UartService>;
    private helper;
    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService);
    private init;
    /**
     * Send serial data
     * @param value The buffer to send
     */
    send(value: BufferSource): Promise<void>;
    /**
     * Send serial text
     * @param value The text to send
     */
    sendText(value: string): Promise<void>;
    private receiveHandler;
    private receiveTextHandler;
}
export {};
