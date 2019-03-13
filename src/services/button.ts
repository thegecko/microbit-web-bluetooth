/*
* micro:bit Web Bluetooth
* Copyright (c) 2019 Rob Moran
*
* The MIT License (MIT)
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

import { EventDispatcher, TypedDispatcher } from "../event-dispatcher";

/**
 * @hidden
 */
export const ButtonUuid = "e95d9882-251d-470a-a062-fa1922dfa9a8";

/**
 * @hidden
 */
export enum ButtonCharacteristic {
    buttonAState = "e95dda90-251d-470a-a062-fa1922dfa9a8",
    buttonBState = "e95dda91-251d-470a-a062-fa1922dfa9a8"
}

export enum ButtonState {
    Release = 0,
    ShortPress = 1,
    LongPress = 2
}

export interface ButtonEvents {
    newListener: keyof ButtonEvents;
    removeListener: keyof ButtonEvents;
    buttonastatechanged: ButtonState;
    buttonbstatechanged: ButtonState;
}

/**
 * @hidden
 */
type ButtonDispatcher = TypedDispatcher<ButtonEvents>;

export class ButtonService extends (EventDispatcher as new() => ButtonDispatcher) {

    private service!: BluetoothRemoteGATTService;

    constructor(private server: BluetoothRemoteGATTServer) {
        super();
        this.on("newListener", this.onNewListener.bind(this));
        this.on("removeListener", this.onRemoveListener.bind(this));
    }

    public async getButtonAState(): Promise<ButtonState> {
        const value = await this.getCharacteristValue(ButtonCharacteristic.buttonAState);
        return value.getUint8(0);
    }

    public async getButtonBState(): Promise<ButtonState> {
        const value = await this.getCharacteristValue(ButtonCharacteristic.buttonBState);
        return value.getUint8(0);
    }

    private async getService(): Promise<BluetoothRemoteGATTService> {
        if (!this.service) {
            this.service = await this.server.getPrimaryService(ButtonUuid);
        }
        return this.service;
    }

    private async getCharacteristValue(characteristic: ButtonCharacteristic): Promise<DataView> {
        const service = await this.getService();
        const char = await service.getCharacteristic(characteristic);
        return await char.readValue();
    }

    private async onNewListener(event: keyof ButtonEvents): Promise<void> {
        const listenerCount = this.listenerCount(event);

        if (listenerCount > 0) {
            return;
        }

        if (event === "buttonastatechanged") {
            const service = await this.getService();
            const char = await service.getCharacteristic(ButtonCharacteristic.buttonAState);
            char.addEventListener("characteristicvaluechanged", this.buttonAStateChangedHandler.bind(this));
            await char.startNotifications();
        }

        if (event === "buttonbstatechanged") {
            const service = await this.getService();
            const char = await service.getCharacteristic(ButtonCharacteristic.buttonBState);
            char.addEventListener("characteristicvaluechanged", this.buttonBStateChangedHandler.bind(this));
            await char.startNotifications();
        }
    }

    private async onRemoveListener(event: keyof ButtonEvents) {
        const listenerCount = this.listenerCount(event);

        if (listenerCount > 0) {
            return;
        }

        if (event === "buttonastatechanged") {
            const service = await this.getService();
            const char = await service.getCharacteristic(ButtonCharacteristic.buttonAState);
            char.removeEventListener("characteristicvaluechanged", this.buttonAStateChangedHandler);
            await char.stopNotifications();
        }

        if (event === "buttonbstatechanged") {
            const service = await this.getService();
            const char = await service.getCharacteristic(ButtonCharacteristic.buttonBState);
            char.removeEventListener("characteristicvaluechanged", this.buttonBStateChangedHandler);
            await char.stopNotifications();
        }
    }

    private buttonAStateChangedHandler(event: Event) {
        this.dispatchEvent("buttonastatechanged", (event.target as BluetoothRemoteGATTCharacteristic).value!.getUint8(0));
    }

    private buttonBStateChangedHandler(event: Event) {
        this.dispatchEvent("buttonbstatechanged", (event.target as BluetoothRemoteGATTCharacteristic).value!.getUint8(0));
    }
}
