# micro:bit Web Bluetooth

Web Bluetooth library for micro:bit implementing the [micro:bit Bluetooth Profile](https://lancaster-university.github.io/microbit-docs/resources/bluetooth/bluetooth_profile.html).

## Prerequisites

[Node.js > v8.14.0](https://nodejs.org), which includes `npm`

## Installation

```bash
$ npm install microbit-web-bluetooth
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
