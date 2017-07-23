'use strict';

jest.dontMock( 'hubble-lights/stores/blinky-manager' );

var Constants = require( 'hubble-lights/constants' );

describe( 'Blinky Manager', function(){

  var dispatcher, blinkyMgr, evt_callback, listener, unreg_lstnr;

  beforeEach( function(){

    jest.resetModules();

    dispatcher = require( 'hubble-lights/dispatcher/app-dispatcher' );

    blinkyMgr = require( 'hubble-lights/stores/blinky-manager' );
    evt_callback = dispatcher.register.mock.calls[0][0];

    // create a mock function and register it as a listener for store state change
    listener = jest.fn();
    unreg_lstnr = blinkyMgr.addListener( listener );
  });

  it( 'should register with the app dispatcher', function(){

    expect( dispatcher.register).toBeCalled();
    expect( typeof evt_callback ).toBe( 'function' );
  });

  it( 'should allow listeners to register and unregister for state changes', function(){

    expect( typeof unreg_lstnr ).toBe( 'function' ); 
    unreg_lstnr();

    evt_callback({
      type: dispatcher.ActionTypes.DEVICE_ACTION_TYPE,
      action: {
        type: Constants.DeviceEvents.BLINKY_DISCOVERED,
        port: { comName: 'DEV-1' }}});

    expect( listener ).not.toBeCalled();  
  });

  it( 'should handle discovery of new BLINKY devices', function(){

    evt_callback({
      type: dispatcher.ActionTypes.DEVICE_ACTION_TYPE,
      action: {
        type: Constants.DeviceEvents.BLINKY_DISCOVERED,
        port: { comName: 'DEV-1' }}});

    expect( listener ).toBeCalled();
    expect( blinkyMgr.getDevice( 'DEV-1' ).isConnected ).toBe( false );
  });

  it( 'should handle FIXTURE_EDIT_NAME of new BLINKY devices', function(){

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action: {
        type: Constants.UserEvents.FIXTURE_EDIT_NAME,
        comName: 'DEV-1',
        userName: 'U-NAME-1' }});

    expect( listener ).toBeCalled();
    expect( blinkyMgr.getDevice( 'DEV-1' ).isConnected ).toBe( false );
  });

  it( 'should ignore discovery of BLINKY device that is already known', function(){

    evt_callback({
      type: dispatcher.ActionTypes.DEVICE_ACTION_TYPE,
      action: {
        type: Constants.DeviceEvents.BLINKY_DISCOVERED,
        port: { comName: 'DEV-1' }}});

    evt_callback({
      type: dispatcher.ActionTypes.DEVICE_ACTION_TYPE,
      action: {
        type: Constants.DeviceEvents.BLINKY_DISCOVERED,
        port: { comName: 'DEV-1' }}});

    expect( listener.mock.calls.length ).toBe( 1 );
  });

  it( 'should fire an event when a linky is connected', function(){

    evt_callback({
      type: dispatcher.ActionTypes.DEVICE_ACTION_TYPE,
      action: {
        type: Constants.DeviceEvents.BLINKY_DISCOVERED,
        port: { comName: 'DEV-1' }}});

    evt_callback({
      type: dispatcher.ActionTypes.DEVICE_ACTION_TYPE,
      action: {
        type: Constants.DeviceEvents.BLINKY_CONNECTED,
        comName: 'DEV-1' }});

    expect( listener ).toBeCalled();
    expect( blinkyMgr.getDevice( 'DEV-1' ).isConnected ).toBe( true );
  });

  it( 'should fire an event when a linky is disconnected', function(){

    evt_callback({
      type: dispatcher.ActionTypes.DEVICE_ACTION_TYPE,
      action: {
        type: Constants.DeviceEvents.BLINKY_DISCOVERED,
        port: { comName: 'DEV-1' }}});

    evt_callback({
      type: dispatcher.ActionTypes.DEVICE_ACTION_TYPE,
      action: {
        type: Constants.DeviceEvents.BLINKY_DISCONNECTED,
        comName: 'DEV-1' }});

    expect( listener ).toBeCalled();
  });
});
