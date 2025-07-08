/*
 *  Freya System Actuators Driver
 *  The hardware-dependent component of the Freya Vivarium Control System, designed
 *  for use with the Edgeberry hardware (Base Board + Sense'n'Drive hardware cartridge).
 *
 *  Copyright© 2025 Sanne “SpuQ” Santens
 *  Released under the MIT License (see LICENSE.txt)
 */

const dbus = require('dbus-native');
import { exec } from 'child_process';

// DBus service
const DBUS_SERVICE = 'io.freya.SystemActuatorsDriver';
const DBUS_PATH = '/io/freya/SystemActuatorsDriver';
const DBUS_INTERFACE = 'io.freya.SystemActuatorsDriver';
// Edgeberry's Sense'n'Drive Hardware Cartridge Digital outputs
const GPIO_LIGHTS="21";       // Digital out 1
const GPIO_HEATER="20";       // Digital out 2
const GPIO_RAIN="16";         // Digital out 3
const GPIO_VENTILATION="12"   // Digital out 5
const GPIO_TLIGHTS="18";      // Digital out 6 - Transitional lights

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

/* DBus */
const systemBus = dbus.systemBus();
if(systemBus){
    console.log('\x1b[32mD-Bus client connected to system bus\x1b[30m');
    registerDbusName();
    createDbusInterface();
}
else{
    console.log('\x1b[31mD-Bus client could not connect to system bus\x1b[30m');
}



/* DBus service object */
const serviceObject = {
                        setDigitalOutput: (arg:string)=>setDigitalOutput(arg, 'test'),
                        emit: (signalName:string, ...otherParameters:any )=>{}
                      }
/*
 *  Register D-Bus name
 */
function registerDbusName(){
    if(!systemBus) return false;
    systemBus.requestName(DBUS_SERVICE,0, (err:string|null, res:number|null)=>{
        if(err){
            console.log('\x1b[31mD-Bus service name aquisition failed: '+err+'\x1b[30m');
            return false;
        }
            else if( res )
            console.log('\x1b[32mD-Bus service name "'+DBUS_SERVICE+'" successfully aquired \x1b[30m');
            return true;
        });
}

/*
 *  Create D-Bus interface
 */
function createDbusInterface(){
    systemBus.exportInterface( DBUS_SERVICE, DBUS_PATH, {
        name: DBUS_INTERFACE,
        methods: {
            setDigitalOutput:['s','']
        },
        signals: {
            updateActuator:['s']
        }
    });
}