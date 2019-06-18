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

import { DeviceInformationService } from "./services/device-information";
import { ButtonService } from "./services/button";
import { LedService } from "./services/led";
import { TemperatureService } from "./services/temperature";
import { AccelerometerService } from "./services/accelerometer";
import { MagnetometerService } from "./services/magnetometer";
import { IoPinService } from "./services/io-pin";
import { UartService } from "./services/uart";
import { EventService } from "./services/event";
import { DfuControlService } from "./services/dfu-control";

export interface Services {
    deviceInformationService?: DeviceInformationService;
    buttonService?: ButtonService;
    ledService?: LedService;
    temperatureService?: TemperatureService;
    accelerometerService?: AccelerometerService;
    magnetometerService?: MagnetometerService;
    uartService?: UartService;
    eventService?: EventService;
    dfuControlService?: DfuControlService;
    ioPinService?: IoPinService;
}

/**
 * @hidden
 */
interface Service {
    uuid: BluetoothCharacteristicUUID;
    create(service: BluetoothRemoteGATTService): Promise<any>;
}

/**
 * @hidden
 */
class ServiceBuilder {

    constructor(private services: BluetoothRemoteGATTService[]) {
    }

    public async createService<T>(serviceClass: (new (service: BluetoothRemoteGATTService) => T) & Service): Promise<T | undefined> {
        const found = this.services.find(service => service.uuid === serviceClass.uuid);

        if (!found) {
            return undefined;
        }

        return await serviceClass.create(found);
    }
}

export const requestMicrobit = async (bluetooth: Bluetooth): Promise<BluetoothDevice | undefined> => {
    const device = await bluetooth.requestDevice({
        filters: [
            {
                namePrefix: "BBC micro:bit"
            }
        ],
        optionalServices: [
            DeviceInformationService.uuid,
            ButtonService.uuid,
            LedService.uuid,
            TemperatureService.uuid,
            AccelerometerService.uuid,
            MagnetometerService.uuid,
            IoPinService.uuid,
            UartService.uuid,
            EventService.uuid,
            DfuControlService.uuid
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
    const builder = new ServiceBuilder(services);

    const deviceInformationService = await builder.createService(DeviceInformationService);
    const buttonService = await builder.createService(ButtonService);
    const ledService = await builder.createService(LedService);
    const temperatureService = await builder.createService(TemperatureService);
    const accelerometerService = await builder.createService(AccelerometerService);
    const magnetometerService = await builder.createService(MagnetometerService);
    const uartService = await builder.createService(UartService);
    const eventService = await builder.createService(EventService);
    const dfuControlService = await builder.createService(DfuControlService);
    const ioPinService = await builder.createService(IoPinService);

    return {
        deviceInformationService,
        buttonService,
        ledService,
        temperatureService,
        accelerometerService,
        magnetometerService,
        uartService,
        eventService,
        dfuControlService,
        ioPinService
    };
};
