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
const DIGITAL_1="21";     // Digital out 1 - Main lights
const DIGITAL_2="20";     // Digital out 2 - Heater
const DIGITAL_3="16";     // Digital out 3 - Misting pump
const DIGITAL_5="12";     // Digital out 5 - Ventialtion
const DIGITAL_6="18";     // Digital out 6 - Auxilary lights

const systemBus = dbus.systemBus();

async function init(){
    // Initialize our DBus service
    if(systemBus){
        console.log('\x1b[32mD-Bus client connected to system bus\x1b[30m');
        try{
            await registerDbusName();
            createDbusInterface();
        }
        catch(e){
            cleanup(1);
        }
    }
    else{
        console.error('\x1b[31mD-Bus client could not connect to system bus\x1b[30m');
        cleanup(1);
    }
}

init();

function cleanup(statuscode:number) {
    console.log('');

    // Release the D-Bus name (dbus-daemon will clean up on exit
    // anyway, but it’s polite to do so ourselfs):
    systemBus.releaseName(DBUS_SERVICE, (err:any) => {
        if (err)
            console.warn('Failed to release bus name:', err);
        else
            console.log(`Released D-Bus name "${DBUS_SERVICE}"`);
    });

    // Turn all outputs off
    // TODO!!!

    // Clean exit
    process.exit(statuscode);
}

/*
 *  System events
 *
 */
// catch the TERM signal (when the process is kindly requested to stop)
process.on('SIGTERM', ()=>cleanup(0));
// (you can also catch SIGINT if you want: e.g. for ctrl-C in development)
process.on('SIGINT', ()=>cleanup(0));

// (optional) catch uncaught exceptions so you can clean up there too
process.on('uncaughtException', err => {
    console.error('Uncaught exception:', err);
    cleanup(1);
});

/*
 *  Actuator controls
 */

// list of Digital Outputs of the Sense'n'Drive Cartridge,
// in order (D1, ..., D6).
const channels = [21,20,16,13,12,18]

/* GPIO controls for the Sense'n'Drive Cartridge digital outputs */
function setDigitalOutput( channel:number, state:boolean ):boolean{
    // Check whether the Channel value is correct
    if( channel <1 || channel >7){
        console.log("Digital output "+channel+" does not exist")
        return false;
    }
    // Translate the channel number to the corresponding digital pin
    const digitalPin = channels[channel-1];
    // Translate the boolean state to the corresponding instruction
    const digitalState = state?'dh':'dl';
    try{
        exec("pinctrl set "+digitalPin+" op "+digitalState);
        return true;
    }
    catch(e){
        console.warn("Failed to set Digital Output: "+e);
        return false;
    }
}

/*
 *  DBus
 */


/* DBus service object */
const serviceObject = {
                        setDigitalOutput: (channel:number, state:boolean, callback:(err:Error|null,success:boolean)=>void)=>{
                          callback( null, setDigitalOutput(channel, state) );
                        },
                        emit: (signalName:string, ...otherParameters:any )=>{}
                      }
/*
 *  Register D-Bus name
 */
function registerDbusName():Promise<void>{
    return new Promise((resolve, reject)=>{
        // If we're not connected to the system DBus, don't even bother
        // to continue...
        if(!systemBus) return reject(new Error('No system bus available'));
        // Request our DBus service name
        systemBus.requestName(DBUS_SERVICE,0, (err:any, res:number)=>{
            if(err){
                console.warn('\x1b[31mD-Bus service name aquisition failed: '+err+'\x1b[30m');
                return reject();
            }
            if( res !== 1){
                console.warn('\x1b[31mUnexpected reply while requesting DBus service name: ' + res + '\x1b[30m');
                return reject(new Error('Unexpected reply: ' + res));
            }
            else
                console.log('\x1b[32mD-Bus service name "'+DBUS_SERVICE+'" successfully aquired \x1b[30m');
                return resolve();
        });
    })
}

/*
 *  Create D-Bus interface
 */
function createDbusInterface(){
    systemBus.exportInterface( DBUS_SERVICE, DBUS_PATH, {
        name: DBUS_INTERFACE,
        methods: {
            setDigitalOutput:['db','b'],
            getDigitalOutput:['d','b']
        },
        signals: {
            updateActuator:['s']
        }
    });
}