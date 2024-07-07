/*
* micro:bit Web Bluetooth
* Copyright (c) 2024 Rob Moran
*
* The MIT License (MIT)
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

import { UartService } from './uart';
import { EventDispatcher, TypedDispatcher } from '../event-dispatcher';

/**
 * Events raised by the RPV service
 */
export interface UartEvents {
    /**
     * @hidden
     */
    newListener: keyof UartEvents;
    /**
     * @hidden
     */
    removeListener: keyof UartEvents;
    /**
     * Command received event
     */
    receiveCommand: {
        command: string;
        value?: number;
    };
}

/**
 * RPC Service
 */
export class RpcService extends (EventDispatcher as new() => TypedDispatcher<UartEvents>) {

    public constructor(protected uartService: UartService) {
        super();
        uartService.addEventListener('receiveText', e => {
            const message = e.detail;
            if (message.startsWith('c:')) {
                const parts = message.replace('c:', '').split(':');
                const command = parts[0];
                const value = parts[1];
                this.emit('receiveCommand', { command, value: value ? parseInt(value, 10) : undefined });
            }
        });
    }

    public async arg(value: number, command = 'arg') {
        const message = `c:${command}:${value}\n`;
        await this.uartService.sendText(message);
    }

    public async narg(command = 'narg') {
        const message = `c:${command}\n`;
        await this.uartService.sendText(message);
    }
}
