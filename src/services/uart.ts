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
export const UartUuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

/**
 * @hidden
 */
export enum UartCharacteristic {
    tx = "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
    rx = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
}

export interface UartEvents {
    newListener: keyof UartEvents;
    removeListener: keyof UartEvents;
    receive: Uint8Array;
    receiveString: string;
}

export class UartService extends (EventDispatcher as new() => TypedDispatcher<UartEvents>) {

    public static async createService(services: BluetoothRemoteGATTService[]): Promise<UartService | undefined> {
        const found = services.find(service => service.uuid === UartUuid);
        if (!found) {
            return undefined;
        }

        const uartService = new UartService(found);
        await uartService.init();
        return uartService;
    }

    constructor(private service: BluetoothRemoteGATTService) {
        super();
    }

    private async init() {
        await this.startNotifications(UartCharacteristic.tx);

        this.on("newListener", this.onNewListener.bind(this));
        this.on("removeListener", this.onRemoveListener.bind(this));
    }

    public async send(value: BufferSource): Promise<void> {
        const char = await this.service.getCharacteristic(UartCharacteristic.rx);
        return char.writeValue(value);
    }

    public async sendString(value: string): Promise<void> {
        const char = await this.service.getCharacteristic(UartCharacteristic.rx);
        const arrayData = value.split("").map((e: string) => e.charCodeAt(0));
        return char.writeValue(new Uint8Array(arrayData).buffer);
    }

    private async startNotifications(characteristic: BluetoothCharacteristicUUID) {
        const char = await this.service.getCharacteristic(characteristic);
        await char.startNotifications();
    }

    private async onNewListener(event: keyof UartEvents): Promise<void> {
        const listenerCount = this.listenerCount(event);

        if (listenerCount > 0) {
            return;
        }

        if (event === "receive") {
            const char = await this.service.getCharacteristic(UartCharacteristic.tx);
            char.addEventListener("characteristicvaluechanged", this.receiveHandler.bind(this));
        }

        if (event === "receiveString") {
            const char = await this.service.getCharacteristic(UartCharacteristic.tx);
            char.addEventListener("characteristicvaluechanged", this.receiveStringHandler.bind(this));
        }
    }

    private async onRemoveListener(event: keyof UartEvents) {
        const listenerCount = this.listenerCount(event);

        if (listenerCount > 0) {
            return;
        }

        if (event === "receive") {
            const char = await this.service.getCharacteristic(UartCharacteristic.tx);
            char.removeEventListener("characteristicvaluechanged", this.receiveHandler.bind(this));
        }

        if (event === "receiveString") {
            const char = await this.service.getCharacteristic(UartCharacteristic.tx);
            char.removeEventListener("characteristicvaluechanged", this.receiveStringHandler.bind(this));
        }
    }

    private receiveHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const value = new Uint8Array(view.buffer);
        this.dispatchEvent("receive", value);
    }

    private receiveStringHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const numberArray = Array.prototype.slice.call(new Uint8Array(view.buffer));
        const value = String.fromCharCode.apply(null, numberArray);
        this.dispatchEvent("receiveString", value);
    }
}
