# micro:bit Web Bluetooth

Web Bluetooth library for micro:bit implementing the [micro:bit Bluetooth Profile](https://lancaster-university.github.io/microbit-docs/resources/bluetooth/bluetooth_profile.html).

## Prerequisites

[Node.js > v10.16.0](https://nodejs.org), which includes `npm`

## Installation

```bash
$ npm install microbit-web-bluetooth
```

## Device Setup

Your micro:bit needs to be running a program which exposes the bluetooth service you wish to interact with. 

Pre-compiled programs exposing bluetooth services are available for testing purposes:

https://github.com/thegecko/microbit-web-bluetooth/tree/main/hex

The first image targets the new micro:bit v2 while older micro:bit v1 versions exist for backwards compatibility:

|Service|[microbit-universal](https://github.com/thegecko/microbit-web-bluetooth/blob/main/hex/ble-open-microbit-universal.hex)|[no-magnet-no-io](https://github.com/thegecko/microbit-web-bluetooth/blob/main/hex/ble-open-no-magnet-no-io.hex)|[no-magnet-no-uart](https://github.com/thegecko/microbit-web-bluetooth/blob/main/hex/ble-open-no-magnet-no-uart.hex)|[no-event-no-uart-no-dfu](https://github.com/thegecko/microbit-web-bluetooth/blob/main/hex/ble-open-no-event-no-uart-no-dfu.hex)|[no-event-no-io-no-temp-no-acc](https://github.com/thegecko/microbit-web-bluetooth/blob/main/hex/ble-open-no-event-no-io-no-temp-no-acc.hex)|
|---|---|---|---|---|---|
|Device Info|✓|✓|✓|✓|✓|
|Button|✓|✓|✓|✓|✓|
|LED|✓|✓|✓|✓|✓|
|Temperature|✓|✓|✓|✓|-|
|Accelerometer|✓|✓|✓|✓|-|
|Event|✓|✓|✓|-|-|
|DFU|✓|✓|✓|-|✓|
|UART|✓|✓|-|-|✓|
|Magnetometer|✓|-|-|✓|✓|
|IO Pin|✓|-|✓|✓|-|

The source for these sample programs is based on the [codal example](https://github.com/lancaster-university/microbit-v2-samples/) with the [main.cpp](https://github.com/thegecko/microbit-web-bluetooth/blob/main/examples/main.cpp) file as [outlined in the examples](https://github.com/thegecko/microbit-web-bluetooth/blob/main/examples).

__Note:__ The `codal.json` configuration must mark `bluetooth` as being `open` in order for Web Bluetooth to work. e.g.:

```json
{
    "target": {
        "name": "codal-microbit",
        "url": "https://github.com/microbit-foundation/codal-microbit",
        "branch": "master",
        "type": "git",
        "test_ignore": true,
        "dev": true
    } ,
    "config":{
        "DEVICE_BLE": 1,
        "MICROBIT_BLE_ENABLED" : 1,
        "MICROBIT_BLE_OPEN" : 1,
        "MICROBIT_BLE_DFU_SERVICE": 1,
        "MICROBIT_BLE_EVENT_SERVICE" : 1,
        "MICROBIT_BLE_DEVICE_INFORMATION_SERVICE": 1
    }
}
```

## Usage

Include the package in your web page, exposing a global named `microbit`:

```html
<script type="text/javascript" src="microbit.umd.js"></script>
```

Use `window.navigator.bluetooth.requestDevice()` to obtain a bluetooth device or use the [requestMicrobit()](globals.html#requestmicrobit) helper to discover a micro:bit:

```javascript
const device = await microbit.requestMicrobit(window.navigator.bluetooth);
```

Use [getServices()](globals.html#getservices) to return an array of available services:

```javascript
const services = await microbit.getServices(device);
```

Services returned could be any of the following:

- [deviceInformationService](modules/services_device_information.html)
- [uartService](modules/services_uart.html)
- [ledService](modules/services_led.html)
- [buttonService](modules/services_button.html)
- [temperatureService](modules/services_temperature.html)
- [accelerometerService](modules/services_accelerometer.html)
- [magnetometerService](modules/services_magnetometer.html)
- [eventService](modules/services_event.html)

Refer to the [web example](https://github.com/thegecko/microbit-web-bluetooth/blob/main/examples/index.html) ([running](https://thegecko.github.io/microbit-web-bluetooth/examples/index.html)) for a full example for each supported service.
