export const LedServiceUuid = "e95dd91d-251d-470a-a062-fa1922dfa9a8";

export const LedCharacteristics = {
    ledMatrixState: "e95d7b77-251d-470a-a062-fa1922dfa9a8",
    ledText: "e95d93ee-251d-470a-a062-fa1922dfa9a8",
    scrollingDelay: "e95d0d2d-251d-470a-a062-fa1922dfa9a8"
};

export class LedService {
    private service!: BluetoothRemoteGATTService;

    constructor(private server: BluetoothRemoteGATTServer) {
    }

    public async setText(text: string): Promise<void> {
        const service = await this.getService();
        const characteristic = await service.getCharacteristic(LedCharacteristics.ledText);
        const encoded = this.encodeString(text);
        return characteristic.writeValue(encoded);
    }

    private async getService(): Promise<BluetoothRemoteGATTService> {
        if (!this.service) {
            this.service = await this.server.getPrimaryService(LedServiceUuid);
        }
        return this.service;
    }

    private encodeString(text: string): ArrayBuffer {
        const buffer = new ArrayBuffer(text.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < text.length; i++) {
            view[i] = text.charCodeAt(i);
        }
        return buffer;
    }
}
