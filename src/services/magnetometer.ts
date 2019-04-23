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
export const MagnetometerUuid = "e95df2d8-251d-470a-a062-fa1922dfa9a8";

/**
 * @hidden
 */
export enum MagnetometerCharacteristic {
    magnetometerData = "e95dfb11-251d-470a-a062-fa1922dfa9a8",
    magnetometerPeriod = "e95d386c-251d-470a-a062-fa1922dfa9a8",
    magnetometerBearing = "e95d9715-251d-470a-a062-fa1922dfa9a8",
    magnetometerCalibration = "e95db358-251d-470a-a062-fa1922dfa9a8"
}

export interface MagnetometerData {
    x: number;
    y: number;
    z: number;
}

export enum MagnetometerCalibration {
    unknown = 0,
    requested = 1,
    completed = 2,
    errored = 3
}

export type MagnetometerPeriod = 1 | 2 | 5 | 10 | 20 | 80 | 160 | 640;

export interface MagnetometerEvents {
    newListener: keyof MagnetometerEvents;
    removeListener: keyof MagnetometerEvents;
    magnetometerdatachanged: MagnetometerData;
    magnetometerbearingchanged: number;
    magnetometercalibrationchanged: MagnetometerCalibration;
}

export class MagnetometerService extends (EventDispatcher as new() => TypedDispatcher<MagnetometerEvents>) {

    public static async createService(services: BluetoothRemoteGATTService[]): Promise<MagnetometerService | undefined> {
        const found = services.find(service => service.uuid === MagnetometerUuid);
        if (!found) {
            return undefined;
        }

        const magnetometerService = new MagnetometerService(found);
        await magnetometerService.init();
        return magnetometerService;
    }

    constructor(private service: BluetoothRemoteGATTService) {
        super();
    }

    private async init() {
        const charD = await this.service.getCharacteristic(MagnetometerCharacteristic.magnetometerData);
        await charD.startNotifications();
        const charB = await this.service.getCharacteristic(MagnetometerCharacteristic.magnetometerBearing);
        await charB.startNotifications();
        const charC = await this.service.getCharacteristic(MagnetometerCharacteristic.magnetometerCalibration);
        await charC.startNotifications();

        this.on("newListener", this.onNewListener.bind(this));
        this.on("removeListener", this.onRemoveListener.bind(this));
    }

    public async calibrate() {
        const char = await this.service.getCharacteristic(MagnetometerCharacteristic.magnetometerCalibration);
        const view = new DataView(new ArrayBuffer(1));
        view.setUint8(0, 1);
        return char.writeValue(view);
    }

    public async readMagnetometerData(): Promise<MagnetometerData> {
        const view = await this.getCharacteristValue(MagnetometerCharacteristic.magnetometerData);
        return this.dataViewToMagnetometerData(view);
    }

    public async getMagnetometerBearing(): Promise<number | undefined> {
        const view = await this.getCharacteristValue(MagnetometerCharacteristic.magnetometerBearing);
        if (view.byteLength === 2) {
            return view.getUint16(0, true);
        }
        return undefined;
    }

    public async getMagnetometerPeriod(): Promise<MagnetometerPeriod> {
        const value = await this.getCharacteristValue(MagnetometerCharacteristic.magnetometerPeriod);
        return value.getUint16(0, true) as MagnetometerPeriod;
    }

    public async setMagnetometerPeriod(frequency: MagnetometerPeriod): Promise<void> {
        const char = await this.service.getCharacteristic(MagnetometerCharacteristic.magnetometerPeriod);
        const view = new DataView(new ArrayBuffer(2));
        view.setUint16(0, frequency, true);
        return char.writeValue(view);
    }

    private async getCharacteristValue(characteristic: BluetoothCharacteristicUUID): Promise<DataView> {
        const char = await this.service.getCharacteristic(characteristic);
        return await char.readValue();
    }

    private async onNewListener(event: keyof MagnetometerEvents): Promise<void> {
        const listenerCount = this.listenerCount(event);

        if (listenerCount > 0) {
            return;
        }

        if (event === "magnetometerdatachanged") {
            const char = await this.service.getCharacteristic(MagnetometerCharacteristic.magnetometerData);
            char.addEventListener("characteristicvaluechanged", this.magnetometerDataChangedHandler.bind(this));
        }

        if (event === "magnetometerbearingchanged") {
            const char = await this.service.getCharacteristic(MagnetometerCharacteristic.magnetometerBearing);
            char.addEventListener("characteristicvaluechanged", this.magnetometerBearingChangedHandler.bind(this));
        }

        if (event === "magnetometercalibrationchanged") {
            const char = await this.service.getCharacteristic(MagnetometerCharacteristic.magnetometerCalibration);
            char.addEventListener("characteristicvaluechanged", this.magnetometerCalibrationChangedHandler.bind(this));
        }
    }

    private async onRemoveListener(event: keyof MagnetometerEvents) {
        const listenerCount = this.listenerCount(event);

        if (listenerCount > 0) {
            return;
        }

        if (event === "magnetometerdatachanged") {
            const char = await this.service.getCharacteristic(MagnetometerCharacteristic.magnetometerData);
            char.removeEventListener("characteristicvaluechanged", this.magnetometerDataChangedHandler.bind(this));
        }

        if (event === "magnetometerbearingchanged") {
            const char = await this.service.getCharacteristic(MagnetometerCharacteristic.magnetometerBearing);
            char.removeEventListener("characteristicvaluechanged", this.magnetometerBearingChangedHandler.bind(this));
        }

        if (event === "magnetometercalibrationchanged") {
            const char = await this.service.getCharacteristic(MagnetometerCharacteristic.magnetometerCalibration);
            char.removeEventListener("characteristicvaluechanged", this.magnetometerCalibrationChangedHandler.bind(this));
        }
    }

    private magnetometerDataChangedHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const value = this.dataViewToMagnetometerData(view);
        this.dispatchEvent("magnetometerdatachanged", value);
    }

    private magnetometerBearingChangedHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        if (view.byteLength === 2) {
            this.dispatchEvent("magnetometerbearingchanged", view.getUint16(0, true));
        }
    }

    private magnetometerCalibrationChangedHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        if (view.byteLength === 1) {
            this.dispatchEvent("magnetometerbearingchanged", view.getUint8(0) as MagnetometerCalibration);
        }
    }

    private dataViewToMagnetometerData(view: DataView): MagnetometerData {
        return {
            x: view.getInt16(0, true),
            y: view.getInt16(1, true),
            z: view.getInt16(2, true)
        };
    }
}
