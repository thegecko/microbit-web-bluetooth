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

import { EventEmitter } from "events";

const DEFAULT_RETRIES = 3;

export interface ServiceEventHandler {
    characteristic: BluetoothCharacteristicUUID;
    handler: (event: Event) => void;
}

export class ServiceHelper {

    private characteristics?: BluetoothRemoteGATTCharacteristic[];

    constructor(private service: BluetoothRemoteGATTService, private emitter?: EventEmitter, private retries = DEFAULT_RETRIES) {
    }

    private async getCharacteristic(uuid: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic | undefined> {
        if (!this.characteristics) {
            this.characteristics = await this.service.getCharacteristics();
        }

        return this.characteristics.find(characteristic => characteristic.uuid === uuid);
    }

    private retry<T>(fn: () => Promise<T>): Promise<T> {
        let tries = 0;
        while (true) {
            tries ++;
            try {
                return fn();
            } catch (error) {
                if (tries === this.retries) {
                    throw error;
                }
            }
        }
    }

    public async getCharacteristicValue(uuid: BluetoothCharacteristicUUID): Promise<DataView> {
        const characteristic = await this.getCharacteristic(uuid);

        if (!characteristic) {
            throw new Error("Unable to locate characteristic");
        }

        return await this.retry(async () => characteristic.readValue());
    }

    public async setCharacteristicValue(uuid: BluetoothCharacteristicUUID, value: BufferSource): Promise<void> {
        const characteristic = await this.getCharacteristic(uuid);

        if (!characteristic) {
            throw new Error("Unable to locate characteristic");
        }

        await this.retry(async () => characteristic.writeValue(value));
    }

    public async handleListener(event: string, uuid: BluetoothCharacteristicUUID, handler: (event: Event) => void) {
        const characteristic = await this.getCharacteristic(uuid);

        if (!characteristic) {
            return;
        }

        await this.retry(async () => characteristic.startNotifications());

        this.emitter!.on("newListener", (emitterEvent: string) => {
            if (emitterEvent !== event || this.emitter!.listenerCount(event) > 0) {
                return;
            }

            return this.retry(async () => characteristic.addEventListener("characteristicvaluechanged", handler));
        });

        this.emitter!.on("removeListener", (emitterEvent: string) => {
            if (emitterEvent !== event || this.emitter!.listenerCount(event) > 0) {
                return;
            }

            return this.retry(async () => characteristic.removeEventListener("characteristicvaluechanged", handler));
        });
    }
}
