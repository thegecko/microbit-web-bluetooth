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

/**
 * @hidden
 */
export const DeviceInformationUuid = 0x180A;

/**
 * @hidden
 */
export enum DeviceInformationCharacteristic {
    modelNumber = "00002a24-0000-1000-8000-00805f9b34fb",
    serialNumber = "00002a25-0000-1000-8000-00805f9b34fb",
    firmwareRevision = "00002a26-0000-1000-8000-00805f9b34fb",
    hardwareRevision = "00002a27-0000-1000-8000-00805f9b34fb",
    manufacturer = "00002a29-0000-1000-8000-00805f9b34fb"
}

export interface DeviceInformation {
    modelNumber?: string;
    serialNumber?: string;
    firmwareRevision?: string;
    hardwareRevision?: string;
    manufacturer?: string;
}

export class DeviceInformationService {
    private service!: BluetoothRemoteGATTService;

    constructor(private server: BluetoothRemoteGATTServer) {
    }

    public async getDeviceInfo(): Promise<DeviceInformation> {
        const service = await this.getService();
        const characteristics = await service.getCharacteristics();
        const info: DeviceInformation = {};

        const modelNumberChar = characteristics.find(char => char.uuid === DeviceInformationCharacteristic.modelNumber);
        if (modelNumberChar) info.modelNumber = await this.readStringCharacteristic(modelNumberChar);
        const serialNumberChar = characteristics.find(char => char.uuid === DeviceInformationCharacteristic.serialNumber);
        if (serialNumberChar) info.serialNumber = await this.readStringCharacteristic(serialNumberChar);
        const firmwareRevisionChar = characteristics.find(char => char.uuid === DeviceInformationCharacteristic.firmwareRevision);
        if (firmwareRevisionChar) info.firmwareRevision = await this.readStringCharacteristic(firmwareRevisionChar);
        const hardwareRevisionChar = characteristics.find(char => char.uuid === DeviceInformationCharacteristic.hardwareRevision);
        if (hardwareRevisionChar) info.hardwareRevision = await this.readStringCharacteristic(hardwareRevisionChar);
        const manufacturerChar = characteristics.find(char => char.uuid === DeviceInformationCharacteristic.manufacturer);
        if (manufacturerChar) info.manufacturer = await this.readStringCharacteristic(manufacturerChar);

        return info;
    }

    private async getService(): Promise<BluetoothRemoteGATTService> {
        if (!this.service) {
            this.service = await this.server.getPrimaryService(DeviceInformationUuid);
        }
        return this.service;
    }

    private async readStringCharacteristic(characteristic: BluetoothRemoteGATTCharacteristic): Promise<string> {
        const view = await characteristic.readValue();
        const buffer = view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
        return String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer)));
    }
}
