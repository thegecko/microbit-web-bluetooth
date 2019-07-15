/// <reference types="web-bluetooth" />
import { TypedDispatcher } from "../event-dispatcher";
/**
 * @hidden
 */
export declare enum EventCharacteristic {
    microBitRequirements = "e95db84c-251d-470a-a062-fa1922dfa9a8",
    microBitEvent = "e95d9775-251d-470a-a062-fa1922dfa9a8",
    clientRequirements = "e95d23c4-251d-470a-a062-fa1922dfa9a8",
    clientEvent = "e95d5404-251d-470a-a062-fa1922dfa9a8"
}
/**
 * micro:bit event
 */
export interface MicrobitEvent {
    /**
     * The type of event
     */
    type: number;
    /**
     * The value for the event
     */
    value: number;
}
/**
 * Events raised by the event service
 */
export interface MicrobitEvents {
    /**
     * @hidden
     */
    newListener: keyof MicrobitEvents;
    /**
     * @hidden
     */
    removeListener: keyof MicrobitEvents;
    /**
     * micro:bit requirements changed event
     */
    microbitrequirementschanged: MicrobitEvent;
    /**
     * micro:bit event event
     */
    microbitevent: MicrobitEvent;
}
declare const EventService_base: new () => TypedDispatcher<MicrobitEvents>;
/**
 * Event Service
 */
export declare class EventService extends EventService_base {
    /**
     * @hidden
     */
    static uuid: string;
    /**
     * @hidden
     */
    static create(service: BluetoothRemoteGATTService): Promise<EventService>;
    private helper;
    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService);
    private init;
    /**
     * Get micro:bit event requirements
     */
    getMicrobitRequirements(): Promise<MicrobitEvent>;
    /**
     * Set client event requirements
     * @param type The type of event to set
     * @param value The value to set
     */
    setClientRequirements(type: number, value: number): Promise<void>;
    /**
     * Read micro:bit event
     */
    readMicrobitEvent(): Promise<MicrobitEvent>;
    /**
     * Write client event
     * @param type The event type
     * @param value The event value
     */
    writeClientEvent(type: number, value: number): Promise<void>;
    private microbitRequirementsChangedHandler;
    private eventHandler;
    private viewToMicrobitEvent;
}
export {};
