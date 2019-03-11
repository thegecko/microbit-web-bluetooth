// import { Services } from "./services";
import { DeviceInformationUuid, DeviceInformationService } from "./services/device-information";
import { ButtonServiceUuid, ButtonService } from "./services/button";
import { LedServiceUuid, LedService } from "./services/led";

export const requestMicrobit = async (bluetooth: Bluetooth): Promise<BluetoothDevice | undefined> => {
    const device = await bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
            DeviceInformationUuid,
            ButtonServiceUuid,
            LedServiceUuid,
            /*
            Services.temperature,
            Services.accelerometer,
            Services.magnetometer,
            Services.io,
            Services.uart,
            Services.event,
            Services.dfu
            */
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
