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

import { DeviceInformationUuid, DeviceInformationService } from "./services/device-information";
import { ButtonUuid, ButtonService } from "./services/button";
import { LedUuid, LedService } from "./services/led";
import { TemperatureUuid } from "./services/temperature";
import { AccelerometerUuid } from "./services/accelerometer";
import { MagnetometerUuid } from "./services/magnetometer";
import { IoPinUuid } from "./services/io-pin";
import { UartUuid } from "./services/uart";
import { EventUuid } from "./services/event";
import { DfuUuid } from "./services/dfu-control";

export const requestMicrobit = async (bluetooth: Bluetooth): Promise<BluetoothDevice | undefined> => {
    const device = await bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
            DeviceInformationUuid,
            ButtonUuid,
            LedUuid,
            TemperatureUuid,
            AccelerometerUuid,
            MagnetometerUuid,
            IoPinUuid,
            UartUuid,
            EventUuid,
            DfuUuid
        ]
    });

    if (!device) return undefined;

    if (device.gatt) {
        await device.gatt.connect();
    }

    return device;
};

export class Microbit {
    constructor(private device: BluetoothDevice) {
    }

    public get deviceInformationService(): DeviceInformationService {
        return new DeviceInformationService(this.device.gatt!);
    }

    public get ledService(): LedService {
        return new LedService(this.device.gatt!);
    }

    public get buttonService(): ButtonService {
        return new ButtonService(this.device.gatt!);
    }
}
