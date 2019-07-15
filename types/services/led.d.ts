/// <reference types="web-bluetooth" />
/**
 * @hidden
 */
export declare enum LedCharacteristic {
    ledMatrixState = "e95d7b77-251d-470a-a062-fa1922dfa9a8",
    ledText = "e95d93ee-251d-470a-a062-fa1922dfa9a8",
    scrollingDelay = "e95d0d2d-251d-470a-a062-fa1922dfa9a8"
}
/**
 * LED matrix structure
 */
export declare type LedMatrix = [[boolean, boolean, boolean, boolean, boolean], [boolean, boolean, boolean, boolean, boolean], [boolean, boolean, boolean, boolean, boolean], [boolean, boolean, boolean, boolean, boolean], [boolean, boolean, boolean, boolean, boolean]];
/**
 * LED Service
 */
export declare class LedService {
    /**
     * @hidden
     */
    static uuid: string;
    /**
     * @hidden
     */
    static create(service: BluetoothRemoteGATTService): Promise<LedService>;
    private helper;
    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService);
    /**
     * Write text to the LED matrix
     * @param text Te text to display
     */
    writeText(text: string): Promise<void>;
    /**
     * Read matrix state
     */
    readMatrixState(): Promise<LedMatrix>;
    /**
     * Write matrix state
     * @param state The matrix data to set
     */
    writeMatrixState(state: LedMatrix): Promise<void>;
    /**
     * Get scrolling delay
     */
    getScrollingDelay(): Promise<number>;
    /**
     * Set scrolling delay
     * @param delay The delay to set (milliseconds)
     */
    setScrollingDelay(delay: number): Promise<void>;
    private encodeString;
    private viewToLedMatrix;
    private byteToBoolArray;
    private ledMatrixToView;
    private boolArrayToByte;
}
