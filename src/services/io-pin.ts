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

import { ServiceHelper } from "../service-helper";

/**
 * @hidden
 */
export enum IoPinCharacteristic {
    pinData = "e95d8d00-251d-470a-a062-fa1922dfa9a8",
    pinAdConfiguration = "e95d5899-251d-470a-a062-fa1922dfa9a8",
    pinIoConfiguration = "e95db9fe-251d-470a-a062-fa1922dfa9a8",
    pwmControl = "e95dd822-251d-470a-a062-fa1922dfa9a8"
}

export class IoPinService {

    /**
     * @hidden
     */
    public static uuid = "e95d127b-251d-470a-a062-fa1922dfa9a8";

    /**
     * @hidden
     */
    public static async create(service: BluetoothRemoteGATTService): Promise<IoPinService> {
        return new IoPinService(service);
    }

    public helper: ServiceHelper;

    constructor(service: BluetoothRemoteGATTService) {
        this.helper = new ServiceHelper(service);
    }
}
