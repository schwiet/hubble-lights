'use strict';

jest.dontMock( 'hubble-lights/stores/scenes' );

var Constants = require( 'hubble-lights/constants' );

describe( 'Scenes', function(){

  var dispatcher, scenes, evt_callback, listener, unreg_lstnr;

  beforeEach( function(){

    jest.resetModules();

    dispatcher = require( 'hubble-lights/dispatcher/app-dispatcher' );

    scenes = require( 'hubble-lights/stores/scenes' );
    evt_callback = dispatcher.register.mock.calls[0][0];

    // create a mock function and register it as a listener for store state change
    listener = jest.fn();
    unreg_lstnr = scenes.addListener( listener );
  });

  it( 'should register with the app dispatcher', function(){

    expect( dispatcher.register).toBeCalled();
    expect( typeof evt_callback ).toBe( 'function' );
  });


  it( 'should handle SCENE_ADDED events', function(){

    var test_scene = {
      name: 'test-scene',
      hotkey: null,
      rate: 20,
      fixtures: {
        dev1ComName: {
          skipCount: 0,
          loop: true,
          imgId: 'just/holds/a/path/to/img'
        } 
      }
    };

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action:{
        type: Constants.UserEvents.SCENE_ADDED,
        scene: test_scene 
      }
    });

    expect( listener ).toBeCalled();
    expect( scenes.getScenes() ).toEqual( [ test_scene ] ); 
  });
});
