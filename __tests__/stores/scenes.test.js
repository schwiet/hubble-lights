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


  it( 'should handle SCENE_EDIT_NAME events', function(){

    var scene_entries,
        renamed_scene = {
      name: 'original name'
    };

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action:{
        type: Constants.UserEvents.SCENE_ADDED,
        scene: renamed_scene }});

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action:{
        type: Constants.UserEvents.SCENE_EDIT_NAME,
        oldName: 'original name',
        newName: 'new name' }});

    expect( listener.mock.calls.length ).toBe( 2 );

    scene_entries = scenes.getScenes();
    expect( scene_entries[ 0 ].name ).toBe( 'new name' ); 
  });

  it( 'should handle SCENE_EDIT_RATE events', function(){

    var scene_entries,
        rate_scene = {
      name: 'a-name',
      rate: 100
    };

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action:{
        type: Constants.UserEvents.SCENE_ADDED,
        scene: rate_scene }});

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action:{
        type: Constants.UserEvents.SCENE_EDIT_RATE,
        name: 'a-name',
        rate: 200 }});

    expect( listener.mock.calls.length ).toBe( 2 );

    scene_entries = scenes.getScenes();
    expect( scene_entries[ 0 ].rate ).toBe( 200 ); 
  });

  it( 'should handle SCENE_EDIT_FIXTURE events', function(){

    var scene_entries, fixture,
        fixture_scene = {
      name: 'a-name',
      fixtures: {
        devComName: {
          skipCount: 0,
          loop: true,
          imgId: 'a/path'
        }
      }
    };

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action:{
        type: Constants.UserEvents.SCENE_ADDED,
        scene: fixture_scene }});

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action:{
        type: Constants.UserEvents.SCENE_EDIT_FIXTURE,
        name: 'a-name',
        fixture: { name: 'devComName', skipCount: 1, loop: false, imgId: 'different' }}});

    expect( listener.mock.calls.length ).toBe( 2 );

    scene_entries = scenes.getScenes();
    fixture = scene_entries[ 0 ].fixtures[ 'devComName' ];
    expect( fixture.skipCount ).toBe( 1 ); 
    expect( fixture.loop ).toBe( false ); 
    expect( fixture.imgId ).toBe( 'different' ); 
  });

  it( 'should handle SCENE_EDIT_FIXTURE event even when not existing', function(){

    var scene_entries, fixture,
        fixture_scene = {
      name: 'a-name',
      fixtures: {}
    };

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action:{
        type: Constants.UserEvents.SCENE_ADDED,
        scene: fixture_scene }});

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action:{
        type: Constants.UserEvents.SCENE_EDIT_FIXTURE,
        name: 'a-name',
        fixture: { name: 'devComName', skipCount: 1, loop: false, imgId: 'different' }}});

    expect( listener.mock.calls.length ).toBe( 2 );

    scene_entries = scenes.getScenes();
    fixture = scene_entries[ 0 ].fixtures[ 'devComName' ];
    expect( fixture.skipCount ).toBe( 1 ); 
    expect( fixture.loop ).toBe( false ); 
    expect( fixture.imgId ).toBe( 'different' ); 
  });

  it( 'should handle FIXTURE_EDIT_IMG event even', function(){

    var scene_entries, fixture,
        fixture_scene = {
      name: 'a-name',
      fixtures: {
        'a-fixture': { imdId: 'original' }
      }
    };

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action:{
        type: Constants.UserEvents.SCENE_ADDED,
        scene: fixture_scene }});

    evt_callback({
      type: dispatcher.ActionTypes.USER_ACTION_TYPE,
      action:{
        type: Constants.UserEvents.FIXTURE_EDIT_IMG,
        sceneName: 'a-name',
        fixtureName: 'a-fixture',
        imgId:       'new-img'
      }
    });

    expect( listener.mock.calls.length ).toBe( 2 );

    scene_entries = scenes.getScenes();
    fixture = scene_entries[ 0 ].fixtures[ 'a-fixture' ];
    expect( fixture.imgId ).toBe( 'new-img' ); 
  });
});
