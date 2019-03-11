import { EventEmitter } from "events";

/**
 * @hidden
 */
export class EventTarget extends EventEmitter {

    public addEventListener(event: string | symbol, listener: (...args: any[]) => void) {
        return super.addListener(event, listener);
    }

    public removeEventListener(event: string | symbol, listener: (...args: any[]) => void) {
        return super.removeListener(event, listener);
    }

    public dispatchEvent(event: string | symbol, value?: any) {
        return super.emit(event, {
            type: event,
            target: this,
            value: value
        });
    }
}
