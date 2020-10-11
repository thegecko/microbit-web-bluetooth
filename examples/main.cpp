#include "MicroBit.h"
#include "MicroBitUARTService.h"

// Create a global instance of the MicroBit model called uBit.
// Allows this singleton to be accessed consistently by tests/programs.

#ifdef MICROBIT_UBIT_AS_STATIC_OBJECT
// A statically allocated model can be simply created using the code below.
// This is the simplest, and ideal for C/C++ programs.
MicroBit uBit;

#else
// Alternatively, we can dynamically allocated the model on te heap.
// This is better for testing builds for environments that do this (such as MakeCode) 
MicroBit &uBit = *(new MicroBit());
#endif

MicroBitUARTService *uart;

const char * const connect_emoji ="\
    000,000,000,000,000\n\
    000,000,000,000,255\n\
    000,000,000,255,000\n\
    255,000,255,000,000\n\
    000,255,000,000,000\n";

const char * const disconnect_emoji ="\
    255,000,000,000,255\n\
    000,255,000,255,000\n\
    000,000,255,000,000\n\
    000,255,000,255,000\n\
    255,000,000,000,255\n";

MicroBitImage connect(connect_emoji);
MicroBitImage disconnect(disconnect_emoji);

int connected = 0;

// We use events and the 'connected' variable to keep track of the status of the Bluetooth connection
void onConnected(MicroBitEvent)
{
    uBit.display.print(connect);
    connected = 1;

    ManagedString eom(":");

    while(connected == 1) {
        ManagedString msg = uart->readUntil(eom);
        uart->send(msg);
    }
}

void onDisconnected(MicroBitEvent)
{
    uBit.display.print(disconnect);
    connected = 0;
}

int 
main()
{
    uBit.sleep(100);
    uBit.init();

    uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_CONNECTED, onConnected);
    uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_DISCONNECTED, onDisconnected);

    new MicroBitMagnetometerService(*uBit.ble, uBit.compass);
    new MicroBitIOPinService(*uBit.ble, uBit.io);
    new MicroBitAccelerometerService(*uBit.ble, uBit.accelerometer);
    new MicroBitTemperatureService(*uBit.ble, uBit.thermometer);
    new MicroBitButtonService(*uBit.ble);
    new MicroBitLEDService(*uBit.ble, uBit.display);
    uart = new MicroBitUARTService(*uBit.ble, 32, 32);

    uBit.display.print(disconnect);
    release_fiber();
}
