'use strict';

jest.dontMock( 'hubble-lights/control/scene-player' );

var Constants = require( 'hubble-lights/constants' );

describe( 'Scene Player', function(){

  var dispatcher, player, evt_callback, conMgr, imgMgr, blinky;

  beforeEach( function(){

    jest.resetModules();

    jest.useFakeTimers();

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
        comN: { skipCount: 10, loop: true, imgId: 'img-id-3' },
        com0: { skipCount: 10, loop: true, imgId: 'img-id-4' },
      }
    },
    scene_2 = Object.assign( {}, scene, { name: 'second-scene' } ),
    fake_blinky = {
      showFrame: jest.fn()  
    };

    conMgr.getConnection.mockReturnValueOnce( 'con-1' );
    conMgr.getConnection.mockReturnValueOnce( 'con-2' );
    conMgr.getConnection.mockReturnValueOnce( 'con-3' ); // won't be used
    conMgr.getConnection.mockReturnValueOnce( null ); // won't be used

    imgMgr.getRgbFrames.mockReturnValueOnce( 'img-1' );
    imgMgr.getRgbFrames.mockReturnValueOnce( 'img-2' );
    imgMgr.getRgbFrames.mockReturnValueOnce( null ); // won't be used
    imgMgr.getRgbFrames.mockReturnValueOnce( 'img-4' ); // won't be used

    blinky.mockReturnValue( fake_blinky );

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action: {
        type: Constants.UserEvents.PLAY_SCENE,
        scene: scene
      }
    });

    expect( conMgr.getConnection ).toBeCalledWith( 'com1' );
    expect( conMgr.getConnection ).toBeCalledWith( 'com2' );
    expect( conMgr.getConnection ).toBeCalledWith( 'comN' );
    expect( conMgr.getConnection ).toBeCalledWith( 'com0' );

    expect( imgMgr.getRgbFrames ).toBeCalledWith( 'img-id' );
    expect( imgMgr.getRgbFrames ).toBeCalledWith( 'img-id-2' );
    expect( imgMgr.getRgbFrames ).toBeCalledWith( 'img-id-3' );
    expect( imgMgr.getRgbFrames ).toBeCalledWith( 'img-id-4' );

    expect( blinky.mock.calls.length ).toBe( 2 );
    expect( blinky ).toBeCalledWith( 'con-1', 'img-1', 0, true );
    expect( blinky ).toBeCalledWith( 'con-2', 'img-2', 10, true );

    // should start timing sequence
    expect( fake_blinky.showFrame.mock.calls.length ).toBe( 2 );
    expect( fake_blinky.showFrame.mock.calls[0][0] ).toBe( 0 );
    expect( fake_blinky.showFrame.mock.calls[1][0] ).toBe( 0 );

    // indicate that the frames have been pushed
    fake_blinky.showFrame.mock.calls[0][1]();
    fake_blinky.showFrame.mock.calls[1][1]();
    
    expect( setTimeout.mock.calls.length ).toBe( 1 );
    expect( setTimeout.mock.calls[0][1] ).toBe( 20 );
    
    // should start the sequence again
    jest.runOnlyPendingTimers();
    expect( fake_blinky.showFrame.mock.calls.length ).toBe( 4 );

    // simulate a new scene being invoked
    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action: {
        type: Constants.UserEvents.PLAY_SCENE,
        scene: scene_2
      }
    });

    // after new scene starts, old scene frame callbacks are called
    fake_blinky.showFrame.mock.calls[2][1]();
    fake_blinky.showFrame.mock.calls[3][1]();

    // sequence should not continue because a new scene has begun!
    expect( setTimeout.mock.calls.length ).toBe( 1 );
  });
});
