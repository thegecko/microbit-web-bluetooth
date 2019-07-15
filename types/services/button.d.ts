/// <reference types="web-bluetooth" />
import { TypedDispatcher } from "../event-dispatcher";
/**
 * @hidden
 */
export declare enum ButtonCharacteristic {
    buttonAState = "e95dda90-251d-470a-a062-fa1922dfa9a8",
    buttonBState = "e95dda91-251d-470a-a062-fa1922dfa9a8"
}
/**
 * Button state enum
 */
export declare enum ButtonState {
    /**
     * Button released
     */
    Release = 0,
    /**
     * Button pressed - short
     */
    ShortPress = 1,
    /**
     * Button pressed - long
     */
    LongPress = 2
}
/**
 * Events raised by the button service
 */
export interface ButtonEvents {
    /**
     * @hidden
     */
    newListener: keyof ButtonEvents;
    /**
     * @hidden
     */
    removeListener: keyof ButtonEvents;
    /**
     * Button A state changed event
     */
    buttonastatechanged: ButtonState;
    /**
     * Button B state changed event
     */
    buttonbstatechanged: ButtonState;
}
declare const ButtonService_base: new () => TypedDispatcher<ButtonEvents>;
/**
 * Button Service
 */
export declare class ButtonService extends ButtonService_base {
    /**
     * @hidden
     */
    static uuid: string;
    /**
     * @hidden
     */
    static create(service: BluetoothRemoteGATTService): Promise<ButtonService>;
    private helper;
    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService);
    private init;
    /**
     * Read state of button A
     */
    readButtonAState(): Promise<ButtonState>;
    /**
     * Read state of button B
     */
    readButtonBState(): Promise<ButtonState>;
    private buttonAStateChangedHandler;
    private buttonBStateChangedHandler;
}
export {};
