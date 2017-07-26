'use strict';

jest.dontMock( 'hubble-lights/util/config-manager' );

var Constants = require( 'hubble-lights/constants' );

describe( 'Config Manager', function(){

  var dispatcher, configMgr, evt_callback;

  beforeEach( function(){

    jest.resetModules();

    dispatcher = require( 'hubble-lights/dispatcher/app-dispatcher' );
  });

  describe( 'no initial config file', function(){
    beforeEach( function(){
      jest.mock( 'hubble-lights/config/hubble-config.json', function(){

        throw new Error( 'file does not exist'  );
      }, {virtual: true} );

      configMgr = require( 'hubble-lights/util/config-manager' );
      evt_callback = dispatcher.register.mock.calls[0][0];
    });
    
    it( 'should register with the app dispatcher', function(){

      expect( dispatcher.register).toBeCalled();
      expect( typeof evt_callback ).toBe( 'function' );
    });

    it( 'should create a blank config, if no file exists', function(){

      expect( dispatcher.handleAppAction ).toBeCalledWith({
        type: Constants.AppEvents.CONFIG_LOADED
      }); 
    });
  });


  describe( 'loading config file', function(){
    beforeEach( function(){
      
      jest.mock( 'hubble-config/hubble-config.json', function(){

        return {
          scenes: [
            { name: 'scene-1' },
            { name: 'scene-2' } 
          ],

          fixtures: [
            { comName: 'com-1', userName: 'l-1' },
            { comName: 'com-2', userName: 'l-2' }
          ]
        };
      }, { virtual: true } );

      configMgr = require( 'hubble-lights/util/config-manager' );
      evt_callback = dispatcher.register.mock.calls[0][0];
    });

    it( 'should fire a SCENE_ADDED event for each scene', function(){

      expect( dispatcher.handleUserAction ).toBeCalledWith({
        type: Constants.UserEvents.SCENE_ADDED, scene: { name: 'scene-1' }
      });

      expect( dispatcher.handleUserAction ).toBeCalledWith({
        type: Constants.UserEvents.SCENE_ADDED, scene: { name: 'scene-2' }
      });
    });

    it( 'should fire a FIXTURE_EDIT_NAME event for each fixture', function(){

      expect( dispatcher.handleUserAction ).toBeCalledWith({
        type: Constants.UserEvents.FIXTURE_EDIT_NAME, comName: 'com-1', userName: 'l-1'
      });

      expect( dispatcher.handleUserAction ).toBeCalledWith({
        type: Constants.UserEvents.FIXTURE_EDIT_NAME, comName: 'com-2', userName: 'l-2'
      });
    });
  });
});
