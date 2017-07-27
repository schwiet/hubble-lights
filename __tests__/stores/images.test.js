'use strict';

jest.dontMock( 'hubble-lights/stores/images' );

var Constants = require( 'hubble-lights/constants' );

describe( 'Images', function(){

  var dispatcher, images, evt_callback, listener, unreg_lstnr;

  beforeEach( function(){

    jest.resetModules();

    dispatcher = require( 'hubble-lights/dispatcher/app-dispatcher' );

    images = require( 'hubble-lights/stores/images' );
    evt_callback = dispatcher.register.mock.calls[0][0];

    // create a mock function and register it as a listener for store state change
    listener = jest.fn();
    unreg_lstnr = images.addListener( listener );
  });

  it( 'should register with the app dispatcher', function(){

    expect( dispatcher.register).toBeCalled();
    expect( typeof evt_callback ).toBe( 'function' );
  });

  it( 'should handle IMAGE_LOADED evt', function(){

    evt_callback({
      type: dispatcher.ActionTypes.APP_ACTION_TYPE,
      action: {
        type: Constants.AppEvents.IMAGE_LOADED,
        imgId: 'filename',
        imgPath: 'path/to/',
        width: 200,
        height: 60
      }
    });

    expect( listener ).toBeCalled();
    expect( images.getImages()[ 'filename' ]).toEqual({
      path: 'path/to/',
      width: 200,
      height: 60
    });
  });
});
