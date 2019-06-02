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

import { EventDispatcher, TypedDispatcher } from "../event-dispatcher";
import { ServiceHelper } from "../service-helper";

/**
 * @hidden
 */
export enum EventCharacteristic {
    microBitRequirements = "e95db84c-251d-470a-a062-fa1922dfa9a8",
    microBitEvent = "e95d9775-251d-470a-a062-fa1922dfa9a8",
    clientRequirements = "e95d23c4-251d-470a-a062-fa1922dfa9a8",
    clientEvent = "e95d5404-251d-470a-a062-fa1922dfa9a8"
}

export interface MicrobitEvent {
    type: number;
    value: number;
}

export interface MicrobitEvents {
    newListener: keyof MicrobitEvents;
    removeListener: keyof MicrobitEvents;
    microbitrequirementschanged: MicrobitEvent;
    microbitevent: MicrobitEvent;
}

export class EventService extends (EventDispatcher as new() => TypedDispatcher<MicrobitEvents>) {

    /**
     * @hidden
     */
    public static uuid = "e95d93af-251d-470a-a062-fa1922dfa9a8";

    /**
     * @hidden
     */
    public static async create(service: BluetoothRemoteGATTService): Promise<EventService> {
        const bluetoothService = new EventService(service);
        await bluetoothService.init();
        return bluetoothService;
    }

    private helper: ServiceHelper;

    constructor(service: BluetoothRemoteGATTService) {
        super();
        this.helper = new ServiceHelper(service, this);
    }

    private async init() {
        await this.helper.handleListener("microbitevent", EventCharacteristic.microBitEvent, this.eventHandler.bind(this));
        await this.helper.handleListener("microbitrequirementschanged", EventCharacteristic.microBitRequirements, this.microbitRequirementsChangedHandler.bind(this));
    }

    public async getMicrobitRequirements(): Promise<MicrobitEvent> {
        const value = await this.helper.getCharacteristicValue(EventCharacteristic.microBitRequirements);
        return this.viewToMicrobitEvent(value);
    }

    public async setClientRequirements(type: number, value: number): Promise<void> {
        const view = new DataView(new ArrayBuffer(4));
        view.setUint16(0, type, true);
        view.setUint16(1, value, true);
        return await this.helper.setCharacteristicValue(EventCharacteristic.clientRequirements, view);
    }

    public async readMicrobitEvent(): Promise<MicrobitEvent> {
        const value = await this.helper.getCharacteristicValue(EventCharacteristic.microBitEvent);
        return this.viewToMicrobitEvent(value);
    }

    public async writeClientEvent(type: number, value: number): Promise<void> {
        const view = new DataView(new ArrayBuffer(4));
        view.setUint16(0, type, true);
        view.setUint16(1, value, true);
        return await this.helper.setCharacteristicValue(EventCharacteristic.clientEvent, view);
    }

    private microbitRequirementsChangedHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const microbitEvent = this.viewToMicrobitEvent(view);
        this.dispatchEvent("microbitrequirementschanged", microbitEvent);
    }

    private eventHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const microbitEvent = this.viewToMicrobitEvent(view);
        this.dispatchEvent("microbitevent", microbitEvent);
    }

    private viewToMicrobitEvent(view: DataView): MicrobitEvent {
        const type = view.getUint16(0, true);
        const value = view.getUint16(1, true);
        return {
            type,
            value
        };
    }
}
