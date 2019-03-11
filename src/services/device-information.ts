export const DeviceInformationUuid = 0x180A;

export const DeviceInformationCharacteristics = {
    modelNumber: "00002a24-0000-1000-8000-00805f9b34fb",
    serialNumber: "00002a25-0000-1000-8000-00805f9b34fb",
    firmwareRevision: "00002a26-0000-1000-8000-00805f9b34fb",
    hardwareRevision: "00002a27-0000-1000-8000-00805f9b34fb",
    manufacturer: "00002a29-0000-1000-8000-00805f9b34fb"
};

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

        const modelNumberChar = characteristics.find(char => char.uuid === DeviceInformationCharacteristics.modelNumber);
        if (modelNumberChar) info.modelNumber = await this.readStringCharacteristic(modelNumberChar);
        const serialNumberChar = characteristics.find(char => char.uuid === DeviceInformationCharacteristics.serialNumber);
        if (serialNumberChar) info.serialNumber = await this.readStringCharacteristic(serialNumberChar);
        const firmwareRevisionChar = characteristics.find(char => char.uuid === DeviceInformationCharacteristics.firmwareRevision);
        if (firmwareRevisionChar) info.firmwareRevision = await this.readStringCharacteristic(firmwareRevisionChar);
        const hardwareRevisionChar = characteristics.find(char => char.uuid === DeviceInformationCharacteristics.hardwareRevision);
        if (hardwareRevisionChar) info.hardwareRevision = await this.readStringCharacteristic(hardwareRevisionChar);
        const manufacturerChar = characteristics.find(char => char.uuid === DeviceInformationCharacteristics.manufacturer);
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
