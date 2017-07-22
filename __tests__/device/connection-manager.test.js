'use strict';

jest.dontMock( 'hubble-lights/device/connection-manager' );

jest.mock( 'serialport', function(){

  var mock_mod = jest.fn();
  mock_mod.list = jest.fn();
 return mock_mod; 
});

var Constants = require( 'hubble-lights/constants' );

describe( 'Connection Manager', function(){

  var dispatcher, evt_callback, conMgr, SerialPort, MockBinding;

  beforeEach( function(){

    jest.resetModules();

    dispatcher = require( 'hubble-lights/dispatcher/app-dispatcher' );
    SerialPort = require( 'serialport' );

    conMgr = require( 'hubble-lights/device/connection-manager' );
    evt_callback = dispatcher.register.mock.calls[0][0];
  });

  it( 'should register with the app dispatcher', function(){

    expect( dispatcher.register ).toBeCalled();
    expect( typeof evt_callback ).toBe( 'function' );
  });

  it( 'should handle new blinky devices', function(){

    var list_cb = SerialPort.list.mock.calls[0][0],
        mock_port = { on: jest.fn() },
        on_cb, on_cl;
    
    SerialPort.mockImplementation( function(){
      return mock_port
    });

    list_cb( null, [{
      comName: 'test-dev',
      manufacturer: 'Blinkinlabs'
    }]);

    expect( SerialPort ).toBeCalledWith( 'test-dev', { baudrate: 115200 } );
    expect( dispatcher.handleDeviceAction ).toBeCalledWith( {
      type: Constants.DeviceEvents.BLINKY_DISCOVERED,
      comName: 'test-dev'
    });

    expect( conMgr.getConnection( 'test-dev' ) ).toBe( mock_port );

    // check the event callbacks on the serial port
    expect( mock_port.on.mock.calls.length ).toBe( 2 );
    expect( mock_port.on.mock.calls[0][0] ).toBe( 'open' );
    expect( mock_port.on.mock.calls[1][0] ).toBe( 'close' );
    on_cb = mock_port.on.mock.calls[0][1];
    on_cl = mock_port.on.mock.calls[1][1];
    expect( typeof on_cb ).toBe( 'function' );
    expect( typeof on_cl ).toBe( 'function' );

    // call the on open callback
    on_cb();
    expect( dispatcher.handleDeviceAction ).toBeCalledWith( {
      type: Constants.DeviceEvents.BLINKY_CONNECTED,
      comName: 'test-dev'
    });
    
    // call the on close callback
    on_cl();
    expect( dispatcher.handleDeviceAction ).toBeCalledWith( {
      type: Constants.DeviceEvents.BLINKY_DISCONNECTED,
      comName: 'test-dev'
    });
    expect( conMgr.getConnection( 'test-dev' ) ).toBeNull();
  });
});
