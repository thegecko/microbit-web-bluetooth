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

import { TypedDispatcher, EventDispatcher } from "../event-dispatcher";

/**
 * @hidden
 */
export const TemperatureUuid = "e95d6100-251d-470a-a062-fa1922dfa9a8";

/**
 * @hidden
 */
export enum TemperatureCharacteristic {
    temperature = "e95d9250-251d-470a-a062-fa1922dfa9a8",
    temperaturePeriod = "e95d1b25-251d-470a-a062-fa1922dfa9a8"
}

export interface TemperatureEvents {
    newListener: keyof TemperatureEvents;
    removeListener: keyof TemperatureEvents;
    temperaturechanged: number;
}

export class TemperatureService extends (EventDispatcher as new() => TypedDispatcher<TemperatureEvents>) {

    public static createService(services: BluetoothRemoteGATTService[]): TemperatureService | undefined {
        const found = services.find(service => service.uuid === TemperatureUuid);
        if (found) {
            return new TemperatureService(found);
        }
        return undefined;
    }

    constructor(private service: BluetoothRemoteGATTService) {
        super();
        this.on("newListener", this.onNewListener.bind(this));
        this.on("removeListener", this.onRemoveListener.bind(this));
    }

    public async readTemperature(): Promise<number> {
        const value = await this.getCharacteristValue(TemperatureCharacteristic.temperature);
        return value.getInt8(0);
    }

    public async getTemperaturePeriod(): Promise<number> {
        const value = await this.getCharacteristValue(TemperatureCharacteristic.temperaturePeriod);
        return value.getUint16(0, true);
    }

    public async setTemperaturePeriod(frequency: number): Promise<void> {
        const char = await this.service.getCharacteristic(TemperatureCharacteristic.temperaturePeriod);
        const view = new DataView(new ArrayBuffer(2));
        view.setUint16(0, frequency, true);
        return char.writeValue(view);
    }

    private async getCharacteristValue(characteristic: BluetoothCharacteristicUUID): Promise<DataView> {
        const char = await this.service.getCharacteristic(characteristic);
        return await char.readValue();
    }

    private async onNewListener(event: keyof TemperatureEvents): Promise<void> {
        const listenerCount = this.listenerCount(event);

        if (listenerCount > 0) {
            return;
        }

        if (event === "temperaturechanged") {
            const char = await this.service.getCharacteristic(TemperatureCharacteristic.temperature);
            char.addEventListener("characteristicvaluechanged", this.temperatureChangedHandler.bind(this));
            await char.startNotifications();
        }
    }

    private async onRemoveListener(event: keyof TemperatureEvents) {
        const listenerCount = this.listenerCount(event);

        if (listenerCount > 0) {
            return;
        }

        if (event === "temperaturechanged") {
            const char = await this.service.getCharacteristic(TemperatureCharacteristic.temperature);
            char.removeEventListener("characteristicvaluechanged", this.temperatureChangedHandler.bind(this));
            await char.stopNotifications();
        }
    }

    private temperatureChangedHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        this.dispatchEvent("temperaturechanged", view.getInt8(0));
    }
}
