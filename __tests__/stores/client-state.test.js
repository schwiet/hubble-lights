'use strict';

jest.dontMock( 'hubble-lights/stores/client-state' );

var Constants = require( 'hubble-lights/constants' );

describe( 'Scenes', function(){

  var dispatcher, clientState, evt_callback, listener, unreg_lstnr;

  beforeEach( function(){

    jest.resetModules();

    dispatcher = require( 'hubble-lights/dispatcher/app-dispatcher' );

    clientState = require( 'hubble-lights/stores/client-state' );
    evt_callback = dispatcher.register.mock.calls[0][0];

    // create a mock function and register it as a listener for store state change
    listener = jest.fn();
    unreg_lstnr = clientState.addListener( listener );
  });

  it( 'should register with the app dispatcher', function(){

    expect( dispatcher.register).toBeCalled();
    expect( typeof evt_callback ).toBe( 'function' );
  });

  it( 'should handle SELECT_SCENE evt' , function(){

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action:{
        type: Constants.UserEvents.SELECT_SCENE,
        sceneName: 'scene-1'
      }
    });

    expect( listener ).toBeCalled();
    expect( clientState.getSelectedScene() ).toBe( 'scene-1' );
  });
});
