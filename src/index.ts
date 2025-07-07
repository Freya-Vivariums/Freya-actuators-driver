/*
 *  Freya System Actuators Driver
 *  The hardware-dependent component of the Freya Vivarium Control System, designed
 *  for use with the Edgeberry hardware (Base Board + Sense'n'Drive hardware cartridge).
 *
 *  by Sanne 'SpuQ' Santens
 */

const dbus = require('dbus-native');
import { exec } from 'child_process';

// Edgeberry's Sense'n'Drive Hardware Cartridge Digital outputs
const GPIO_LIGHTS="21";       // Digital out 1
const GPIO_HEATER="20";       // Digital out 2
const GPIO_RAIN="16";         // Digital out 3
const GPIO_VENTILATION="12"   // Digital out 5
const GPIO_TLIGHTS="18";      // Digital out 6 - Transitional lights

/* DBus */
const systemBus = dbus.systemBus();

/* GPIO controls for the Sense'n'Drive Cartridge digital outputs */
function setDigitalOutput( digitalOutput:string, state:string ){
    const digitalState = state==='on'?'dh':'dl';
    try{
        exec("pinctrl set "+digitalOutput+" op "+digitalState);
    }
    catch(e){
        console.log("Failed to set Digital Output: "+e);
    }
}