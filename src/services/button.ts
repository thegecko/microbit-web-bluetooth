import { EventTarget } from "../event-target";

export const ButtonServiceUuid = "e95d9882-251d-470a-a062-fa1922dfa9a8";

export const ButtonCharacteristics = {
    buttonAState: "e95dda90-251d-470a-a062-fa1922dfa9a8",
    buttonBState: "e95dda91-251d-470a-a062-fa1922dfa9a8"
};

export enum ButtonStates {
    Release = 0,
    ShortPress = 1,
    LongPress = 2
}

export class ButtonService extends EventTarget {
    public static ButtonAStateChangedEvent = "buttonastatechanged";
    public static ButtonAShortPressEvent = "buttonashortpress";
    public static ButtonALongPressEvent = "buttonalongpress";
    public static ButtonAReleaseEvent = "buttonarelease";
    public static ButtonBStateChangedEvent = "buttonbstatechanged";
    public static ButtonBShortPressEvent = "buttonbshortpress";
    public static ButtonBLongPressEvent = "buttonblongpress";
    public static ButtonBReleaseEvent = "buttonbrelease";

    private service!: BluetoothRemoteGATTService;

    constructor(private server: BluetoothRemoteGATTServer) {
        super();
        this.on("newListener", this.onNewListener.bind(this));
        this.on("removeListener", this.onRemoveListener.bind(this));
    }

    private async getService(): Promise<BluetoothRemoteGATTService> {
        if (!this.service) {
            this.service = await this.server.getPrimaryService(ButtonServiceUuid);
        }
        return this.service;
    }

    private async onNewListener(event: any): Promise<void> {
        const listenerCount = this.listenerCount(event);

        if (listenerCount !== 0) {
            return;
        }

        if (event === ButtonService.ButtonAStateChangedEvent) {
            const service = await this.getService();
            const char = await service.getCharacteristic(ButtonCharacteristics.buttonAState);
            char.addEventListener("characteristicvaluechanged", () => {
                this.dispatchEvent(ButtonService.ButtonAStateChangedEvent, char.value!.getUint8(0));
            });
            await char.startNotifications();
        }
    }

    private async onRemoveListener(event: any) {
        const listenerCount = this.listenerCount(event);

        if (listenerCount !== 0) {
            return;
        }

        if (event === ButtonService.ButtonAStateChangedEvent) {
            const service = await this.getService();
            const char = await service.getCharacteristic(ButtonCharacteristics.buttonAState);
            // char.addEventListener("characteristicvaluechanged", () => {
             //   this.emit(ButtonService.ButtonAStateChangedEvent, char.value!.getUint8(0));
            // });
            await char.stopNotifications();
        }
    }
}
