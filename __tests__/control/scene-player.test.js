'use strict';

jest.dontMock( 'hubble-lights/control/scene-player' );

var Constants = require( 'hubble-lights/constants' );

describe( 'Scene Player', function(){

  var dispatcher, player, evt_callback, conMgr, imgMgr, blinky;

  beforeEach( function(){

    dispatcher = require( 'hubble-lights/dispatcher/app-dispatcher' );
    conMgr     = require( 'hubble-lights/device/connection-manager' );
    imgMgr     = require( 'hubble-lights/util/image-manager' );
    blinky     = require( 'hubble-lights/device/blinky' );

    player = require( 'hubble-lights/control/scene-player' );
    evt_callback = dispatcher.register.mock.calls[0][0];
  });

  it( 'should register with the dispatcher', function(){

    expect( dispatcher.register ).toBeCalled();
    expect( typeof evt_callback ).toBe( 'function' );
  });

  it( 'should handle PLAY_SCENE events', function(){

    var scene = {
      name: 'test-scene',
      rate: 20,
      fixtures: {
        com1: { skipCount: 0, loop: true, imgId: 'img-id' },
        com2: { skipCount: 10, loop: true, imgId: 'img-id-2' },
      }
    };

    conMgr.getConnection.mockReturnValueOnce( 'con-2' );
    conMgr.getConnection.mockReturnValueOnce( 'con-1' );

    imgMgr.getRGB.mockReturnValueOnce( 'img-2' );
    imgMgr.getRGB.mockReturnValueOnce( 'img-1' );

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action: {
        type: Constants.UserEvents.PLAY_SCENE,
        scene: scene
      }
    });

    expect( conMgr.getConnection ).toBeCalledWith( 'com1' );
    expect( conMgr.getConnection ).toBeCalledWith( 'com2' );

    expect( imgMgr.getRGB ).toBeCalledWith( 'img-id' );
    expect( imgMgr.getRGB ).toBeCalledWith( 'img-id-2' );

    expect( blinky ).toBeCalledWith( 'con-1', 'img-1' );
  });
});
