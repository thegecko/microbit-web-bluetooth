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

https://github.com/thegecko/microbit-web-bluetooth/tree/master/hex

|Service|[no-magnet-no-io](https://github.com/thegecko/microbit-web-bluetooth/blob/master/hex/ble-open-no-magnet-no-io.hex)|[no-magnet-no-uart](https://github.com/thegecko/microbit-web-bluetooth/blob/master/hex/ble-open-no-magnet-no-uart.hex)|[no-event-no-uart-no-dfu](https://github.com/thegecko/microbit-web-bluetooth/blob/master/hex/ble-open-no-event-no-uart-no-dfu.hex)|[no-event-no-io-no-temp-no-acc](https://github.com/thegecko/microbit-web-bluetooth/blob/master/hex/ble-open-no-event-no-io-no-temp-no-acc.hex)|
|---|---|---|---|---|
|Device Info|✓|✓|✓|✓|
|Button|✓|✓|✓|✓|
|LED|✓|✓|✓|✓|
|Temperature|✓|✓|✓|-|
|Accelerometer|✓|✓|✓|-|
|Event|✓|✓|-|-|
|DFU|✓|✓|-|✓|
|UART|✓|-|-|✓|
|Magnetometer|-|-|✓|✓|
|IO Pin|-|✓|✓|-|

The source for a sample program to do this is [available here](https://github.com/lancaster-university/microbit-samples/tree/master/source/examples/bluetooth-services).

__Note:__ The configuration must mark `bluetooth` as being `open` in order for Web Bluetooth to work. e.g.:

```json
{
    "microbit-dal": {
        "bluetooth": {
            "enabled": 1,
            "pairing_mode": 1,
            "private_addressing": 0,
            "open": 1,
            "whitelist": 1,
            "advertising_timeout": 0,
            "tx_power": 0,
            "dfu_service": 0,
            "event_service": 1,
            "device_info_service": 1,
            "security_level": "SECURITY_MODE_ENCRYPTION_NO_MITM"
        },
        "gatt_table_size": "0x700"
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

- [deviceInformationService](classes/deviceinformationservice.html)
- [uartService](classes/uartservice.html)
- [ledService](classes/ledservice.html)
- [buttonService](classes/buttonservice.html)
- [temperatureService](classes/temperatureservice.html)
- [accelerometerService](classes/accelerometerservice.html)
- [magnetometerService](classes/magnetometerservice.html)
- [eventService](classes/eventservice.html)

Refer to the [web example](https://github.com/thegecko/microbit-web-bluetooth/blob/master/examples/index.html) ([running](https://thegecko.github.io/microbit-web-bluetooth/examples/index.html)) for a full example for each supported service.
