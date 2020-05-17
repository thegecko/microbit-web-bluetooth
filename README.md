# micro:bit Web Bluetooth

[![Circle CI](https://circleci.com/gh/thegecko/microbit-web-bluetooth.svg?style=shield&circle-token=a6f81fc05746394a595d8fe2b7c02eaf3120794b)](https://circleci.com/gh/thegecko/microbit-web-bluetooth/)
[![npm](https://img.shields.io/npm/dm/microbit-web-bluetooth.svg)](https://www.npmjs.com/package/microbit-web-bluetooth)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://spdx.org/licenses/MIT.html)

Web Bluetooth library for micro:bit implementing the [micro:bit Bluetooth Profile](https://lancaster-university.github.io/microbit-docs/resources/bluetooth/bluetooth_profile.html).

## Prerequisites

[Node.js > v10.16.0](https://nodejs.org), which includes `npm`

## Getting Started

Refer to the [micro:bit Web Bluetooth API Documentation](https://thegecko.github.io/microbit-web-bluetooth/) for more information.

## Implementation Status
- [x] micro:bit Discovery
- [x] Service enumeration

### Device Information Service
- [x] Model Number
- [x] Serial Number
- [x] Hardware Revision
- [x] Firmware Revision
- [x] Manufacturer

### LED Service
- [x] LED Matrix State
- [x] LED Text
- [x] Scrolling Delay

### Button Service
- [x] Button A State
- [x] Button A State Changed Event
- [x] Button B State
- [x] Button B State Changed Event

### Temperature Service
- [x] Temperature
- [x] Temperature Changed Event
- [x] Temperature Period

### Accelerometer Service
- [x] Accelerometer Data
- [x] Accelerometer Data Changed Event
- [x] Accelerometer Period

### Magnetometer Service
- [x] Magnetometer Data
- [x] Magnetometer Data Changed Event
- [x] Magnetometer Period
- [x] Magnetometer Bearing
- [x] Magnetometer Bearing Changed Event
- [x] Magnetometer Calibration

### UART Service
- [x] Send
- [x] Receive Event
- [x] SendString
- [x] ReceiveString Event

### Event Service
- [x] MicroBit Requirements
- [x] MicroBit Event
- [x] Client Requirements
- [x] Client Event

### IO Pin Service
- [x] Pin Data
- [x] Pin Data Changed Event
- [x] Pin AD Configuration
- [x] Pin IO Configuration
- [x] PWM Control

### DFU Control Service
- [x] Request DFU
- [x] Request Flash Code
