'use strict';

jest.dontMock( 'hubble-lights/util/image-manager' );

jest.mock( 'jimp', function(){

  var cat = { catch: jest.fn() },
      prom = { then: jest.fn( function(){ return cat; } ) };
  return{

    cat:  cat,
    prom: prom,
    read: jest.fn( function(){ return prom; } )
  }
});

var Constants = require( 'hubble-lights/constants' );

describe( 'Image Manager', function(){

  var dispatcher, imgMgr, evt_callback, jimp;

  beforeEach( function(){

    jest.resetModules();

    dispatcher = require( 'hubble-lights/dispatcher/app-dispatcher' );
    jimp = require( 'jimp' );

    imgMgr = require( 'hubble-lights/util/image-manager' );
    evt_callback = dispatcher.register.mock.calls[0][0];
  });

  it( 'should register with the app dispatcher', function(){

    expect( dispatcher.register).toBeCalled();
    expect( typeof evt_callback ).toBe( 'function' );
  });

  it( 'should load images indicated in SCENE_ADDED events', function(){

    var test_scene = {
      name: 'test-scene',
      hotkey: null,
      rate: 20,
      fixtures: {
        dev1ComName: {
          skipCount: 0,
          loop: true,
          imgId: 'img-id'
        } 
      }
    },
    mock_img = {
      scan: jest.fn(),
      bitmap: { width: 10, height: 5, data: [] } 
    };

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action: {
        type: Constants.UserEvents.SCENE_ADDED,
        scene: test_scene
      }
    });

    expect( jimp.read ).toBeCalledWith( imgMgr.IMG_PATH + 'img-id' );

    expect( jimp.prom.then.mock.calls.length ).toBe( 1 );
    jimp.prom.then.mock.calls[0][0]( mock_img );

    expect( mock_img.scan.mock.calls.length ).toBe( 1 );
    expect( mock_img.scan.mock.calls[0][0] ).toBe( 0 );
    expect( mock_img.scan.mock.calls[0][1] ).toBe( 0 );
    expect( mock_img.scan.mock.calls[0][2] ).toBe( 10 );
    expect( mock_img.scan.mock.calls[0][3] ).toBe( 5 );

    for( var x = 0; x < 10; x += 1 ){
      for( var y = 0; y < 5; y += 1 ){

        mock_img.scan.mock.calls[0][4].bind( mock_img )( x, y, (x*10 + y) );
      }
    }

    expect( dispatcher.handleAppAction.mock.calls.length ).toBe( 1 );
    expect( dispatcher.handleAppAction ).toBeCalledWith({
      type: Constants.AppEvents.IMAGE_LOADED, img: 'img-id'
    });

    expect( imgMgr.getRgbFrames( 'img-id' ).length ).toBe( 10 );
    expect( imgMgr.getRgbFrames( 'img-id' )[0].length ).toBe( 5 );
  });
});
