/// <reference types="web-bluetooth" />
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
export declare const requestMicrobit: (bluetooth: Bluetooth) => Promise<BluetoothDevice | undefined>;
export declare const getServices: (device: BluetoothDevice) => Promise<Services>;
