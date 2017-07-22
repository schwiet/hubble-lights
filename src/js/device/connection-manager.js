'use strict';

var Dispatcher   = require( 'hubble-lights/dispatcher/app-dispatcher' ),
    Constants    = require( 'hubble-lights/constants' ),
    SerialPort   = require( 'serialport' );

// FUNCTIONS
var _check_device;

// STATE
var _devices = [];

////////////////////////////////////////////////////////////////////
// * CONNECTION MANAGER MODULE *
//
// is a singleton that takes care of discovering and connecting to
// devices.
////////////////////////////////////////////////////////////////////

var ConnectionManager = {

  /*
   * returns the connection for the given comName if one is open.
   * @return the specified SerialPort connection, if any.
   *         Otherwise, returns false.
   */
  getConnection: function( comName ){

    return _devices[ comName ] || null;
  }
};

module.exports = ConnectionManager;

////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////

_check_device = function( device ){

  var new_dev;

  if( !_devices[ device.comName ] ){

    switch( device.manufacturer ){

    case 'Blinkinlabs':
      // create the serial port connection and fire an event when the
      // connection is opened
      new_dev = new SerialPort( device.comName, { baudrate: 115200 } );
      new_dev.on( "open", Dispatcher.handleDeviceAction.bind( Dispatcher, {
        type: Constants.DeviceEvents.BLINKY_CONNECTED,
        comName: device.comName
      }));

      // keep reference to the connection
      _devices[ device.comName ] = new_dev;

      // when the connection is closed, remove reference
      new_dev.on( "close", function(){

        _devices[ device.comName ] = null;

        Dispatcher.handleDeviceAction({
          type: Constants.DeviceEvents.BLINKY_DISCONNECTED,
          comName: device.comName
        });
      });

      // Fire an event noting that the device was discovered
      Dispatcher.handleDeviceAction({
        type: Constants.DeviceEvents.BLINKY_DISCOVERED,
        comName: device.comName
      });
      break;
    }
  }
};

( function poll_for_devices(){

  // list the available ports, then check each, connecting to new
  // ones of interest
  SerialPort.list( function( err, ports ){
    ports.forEach( _check_device );
  });

  setTimeout( poll_for_devices, 3000 );
}());

// Register for global Dispatched events
ConnectionManager.dispatchToken = Dispatcher.register( function( payload ){
  // TODO: may not need to respond to any events...
});
