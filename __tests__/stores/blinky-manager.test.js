'use strict';

jest.dontMock( 'hubble-lights/stores/blinky-manager' );
jest.dontMock( 'serialport' );

var Constants = require( 'hubble-lights/constants' );

describe( 'Blinky Manager', function(){

  var dispatcher, blinkyMgr, blinky, evt_callback;

  beforeEach( function(){

    dispatcher = require( 'hubble-lights/dispatcher/app-dispatcher' );
    blinky     = require( 'hubble-lights/device/blinky' );

    blinkyMgr = require( 'hubble-lights/stores/blinky-manager' );
    evt_callback = dispatcher.register.mock.calls[0][0];
  });

  it( 'should register with the app dispatcher', function(){

    expect( dispatcher.register).toBeCalled();
    expect( typeof evt_callback ).toBe( 'function' );
  });

  it( 'should handle discovery of new BLINKY devices', function(){

    evt_callback({
      type: dispatcher.ActionTypes.DEVICE_ACTION_TYPE,
      action: {
        type: Constants.DeviceEvents.BLINKY_DISCOVERED,
        port: 123,
        devName: 'dev/test-dev'
      }
    });

    expect( blinky ).toBeCalled();
  });
});
