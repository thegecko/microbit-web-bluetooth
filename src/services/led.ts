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
export const LedUuid = "e95dd91d-251d-470a-a062-fa1922dfa9a8";

/**
 * @hidden
 */
export enum LedCharacteristic {
    ledMatrixState = "e95d7b77-251d-470a-a062-fa1922dfa9a8",
    ledText = "e95d93ee-251d-470a-a062-fa1922dfa9a8",
    scrollingDelay = "e95d0d2d-251d-470a-a062-fa1922dfa9a8"
}

export class LedService {
    private service!: BluetoothRemoteGATTService;

    constructor(private server: BluetoothRemoteGATTServer) {
    }

    public async setText(text: string): Promise<void> {
        const service = await this.getService();
        const characteristic = await service.getCharacteristic(LedCharacteristic.ledText);
        const encoded = this.encodeString(text);
        return characteristic.writeValue(encoded);
    }

    private async getService(): Promise<BluetoothRemoteGATTService> {
        if (!this.service) {
            this.service = await this.server.getPrimaryService(LedUuid);
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
