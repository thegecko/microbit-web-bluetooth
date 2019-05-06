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
import { TemperatureUuid, TemperatureService } from "./services/temperature";
import { AccelerometerUuid, AccelerometerService } from "./services/accelerometer";
import { MagnetometerUuid, MagnetometerService } from "./services/magnetometer";
import { IoPinUuid } from "./services/io-pin";
import { UartUuid, UartService } from "./services/uart";
import { EventUuid, EventService } from "./services/event";
import { DfuUuid } from "./services/dfu-control";

export interface Services {
    deviceInformationService?: DeviceInformationService;
    buttonService?: ButtonService;
    ledService?: LedService;
    temperatureService?: TemperatureService;
    accelerometerService?: AccelerometerService;
    magnetometerService?: MagnetometerService;
    uartService?: UartService;
    eventService?: EventService;
}

export const requestMicrobit = async (bluetooth: Bluetooth): Promise<BluetoothDevice | undefined> => {
    const device = await bluetooth.requestDevice({
        filters: [
            {
                namePrefix: "BBC micro:bit"
            }
        ],
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

    return device;
};

export const getServices = async (device: BluetoothDevice): Promise<Services> => {
    if (!device || !device.gatt) {
        return {};
    }

    if (!device.gatt.connected) {
        await device.gatt.connect();
    }

    const services = await device.gatt.getPrimaryServices();
    const deviceInformationService = await DeviceInformationService.createService(services);
    const buttonService = await ButtonService.createService(services);
    const ledService = await LedService.createService(services);
    const temperatureService = await TemperatureService.createService(services);
    const accelerometerService = await AccelerometerService.createService(services);
    const magnetometerService = await MagnetometerService.createService(services);
    const uartService = await UartService.createService(services);
    const eventService = await EventService.createService(services);

    return {
        deviceInformationService,
        buttonService,
        ledService,
        temperatureService,
        accelerometerService,
        magnetometerService,
        uartService,
        eventService,
    };
};
