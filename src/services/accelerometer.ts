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
export const AccelerometerUuid = "e95d0753-251d-470a-a062-fa1922dfa9a8";

/**
 * @hidden
 */
export enum AccelerometerCharacteristic {
    accelerometerData = "e95dca4b-251d-470a-a062-fa1922dfa9a8",
    accelerometerPeriod = "e95dfb24-251d-470a-a062-fa1922dfa9a8"
}

export interface AccelerometerData {
    x: number;
    y: number;
    z: number;
}

export type AccelerometerPeriod = 1 | 2 | 5 | 10 | 20 | 80 | 160 | 640;

export interface AccelerometerEvents {
    newListener: keyof AccelerometerEvents;
    removeListener: keyof AccelerometerEvents;
    accelerometerdatachanged: AccelerometerData;
}

export class AccelerometerService extends (EventDispatcher as new() => TypedDispatcher<AccelerometerEvents>) {

    public static createService(services: BluetoothRemoteGATTService[]): AccelerometerService | undefined {
        const found = services.find(service => service.uuid === AccelerometerUuid);
        if (found) {
            return new AccelerometerService(found);
        }
        return undefined;
    }

    constructor(private service: BluetoothRemoteGATTService) {
        super();
        this.on("newListener", this.onNewListener.bind(this));
        this.on("removeListener", this.onRemoveListener.bind(this));
    }

    public async readAccelerometerData(): Promise<AccelerometerData> {
        const view = await this.getCharacteristValue(AccelerometerCharacteristic.accelerometerData);
        return this.dataViewToAccelerometerData(view);
    }

    public async getAccelerometerPeriod(): Promise<AccelerometerPeriod> {
        const value = await this.getCharacteristValue(AccelerometerCharacteristic.accelerometerPeriod);
        return value.getUint16(0, true) as AccelerometerPeriod;
    }

    public async setAccelerometerPeriod(frequency: AccelerometerPeriod): Promise<void> {
        const char = await this.service.getCharacteristic(AccelerometerCharacteristic.accelerometerPeriod);
        const view = new DataView(new ArrayBuffer(2));
        view.setUint16(0, frequency, true);
        return char.writeValue(view);
    }

    private async getCharacteristValue(characteristic: BluetoothCharacteristicUUID): Promise<DataView> {
        const char = await this.service.getCharacteristic(characteristic);
        return await char.readValue();
    }

    private async onNewListener(event: keyof AccelerometerEvents): Promise<void> {
        const listenerCount = this.listenerCount(event);

        if (listenerCount > 0) {
            return;
        }

        if (event === "accelerometerdatachanged") {
            const char = await this.service.getCharacteristic(AccelerometerCharacteristic.accelerometerData);
            char.addEventListener("characteristicvaluechanged", this.accelerometerDataChangedHandler.bind(this));
            await char.startNotifications();
        }
    }

    private async onRemoveListener(event: keyof AccelerometerEvents) {
        const listenerCount = this.listenerCount(event);

        if (listenerCount > 0) {
            return;
        }

        if (event === "accelerometerdatachanged") {
            const char = await this.service.getCharacteristic(AccelerometerCharacteristic.accelerometerData);
            char.removeEventListener("characteristicvaluechanged", this.accelerometerDataChangedHandler.bind(this));
            await char.stopNotifications();
        }
    }

    private accelerometerDataChangedHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const value = this.dataViewToAccelerometerData(view);
        this.dispatchEvent("accelerometerdatachanged", value);
    }

    private dataViewToAccelerometerData(view: DataView): AccelerometerData {
        return {
            x: view.getInt16(0, true) / 1000.0,
            y: view.getInt16(2, true) / 1000.0,
            z: view.getInt16(4, true) / 1000.0
        };
    }
}
