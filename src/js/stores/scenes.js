'use strict';

var Dispatcher   = require( 'hubble-lights/dispatcher/app-dispatcher' ),
    EventEmitter = require( 'events' ).EventEmitter,
    Constants    = require( 'hubble-lights/constants' );

var _handle_user_evt, _get_scene_by_name;

var _scenes = [];

/////////////////////////////////////////////////////////////////
// * SCENES MODULE *
//
// Scenes keeps track of the runtime state of Scene
// configurations. This includes global Scene settings as well
// as the per-scene configuration of available light fixtures
/////////////////////////////////////////////////////////////////

var Scenes = Object.assign( {}, EventEmitter.prototype, {
  
  /*
   * Adds a listener for change events on this store. The
   * provided callback will be invoked each time this store's
   * state changes
   *
   * @param callback - function to be invoked on state change
   * @return a function to remove listener
   */
  addListener: function( callback ){

    this.on( 'SCENE-UPDATE', callback );

    return this.removeListener.bind( this, 'SCENE-UPDATE', callback );
  },

  /*
   * returns the list of scenes along with their configuration.
   * @return the collection of scene configurations. Don't modify
   *         this directly. It is meant to be updated via
   *         Dispatched events.
   */
  getScenes: function(){

    return _scenes;
  }
});

module.exports = Scenes;

/////////////////////////////////////////////////////////////////
// PRIVATE IMPLEMENTATION
/////////////////////////////////////////////////////////////////

// searches what should be a pretty small list for a scene with
// the specified name. Note that names can change.
_get_scene_by_name = function( scene_name ){

  var result = null;

  _scenes.some( function( scene ){

    if( scene.name === scene_name ){
      result = scene;
      return true;
    }
    return false;
  });

  return result;
};

_handle_user_evt = function( evt ){

  var changed = false, scene, fixture;

  switch( evt.type ){

  case Constants.UserEvents.SCENE_ADDED:

    // check that the scene has a name and that we don't
    // already have a scene by that name
    // TODO: may want to have more thorough validation
    //       of the scene object
    if( evt.scene.name && !_get_scene_by_name( evt.scene.name ) ){

      _scenes.push( evt.scene );
    }
    changed = true;
    break;

  case Constants.UserEvents.SCENE_EDIT_NAME:

    // get the scene with the old name. If it exists and the new
    // name is different, change it and indicate state change
    scene = _get_scene_by_name( evt.oldName );

    if( scene && evt.newName !== scene.name ){
      scene.name = evt.newName;
      changed = true;
    }
    break;

  case Constants.UserEvents.SCENE_EDIT_RATE:

    // change the rate of the scene indicated by name if it is
    // different than what is already set.
    scene = _get_scene_by_name( evt.name );

    if( scene && evt.rate !== scene.rate ){
      scene.rate = evt.rate;
      changed = true;
    }
    break;

  case Constants.UserEvents.SCENE_EDIT_FIXTURE:

    // get the specified scene and update the fixture's configuration
    // for that scene
    scene = _get_scene_by_name( evt.name );

    if( scene ){
      fixture = scene.fixtures[ evt.fixture.name ];

      // if we don't have a configuration for that fixture,
      // create one and store it
      if( !fixture ){
        console.log( "INFO - SCENES: creating a new fixture configuration:"
            , evt.fixture.name, "for scene:", scene.name );
        fixture = { name: evt.fixture.name };
        scene.fixtures[ evt.fixture.name ] = fixture;
      }

      // update each attribute
      fixture.skipCount = evt.fixture.skipCount;
      fixture.loop = evt.fixture.loop;
      fixture.imgId = evt.fixture.imgId;
      changed = true;
    }
    else{
      console.log( "WARN - SCENES: Do not have a record of Scene:", evt.name );
    }
    break;
  }

  return changed;
};


// Register for global Dispatched events
Scenes.dispatchToken = Dispatcher.register( function( payload ){

  var changed = false;

  switch( payload.type ){

  case Dispatcher.ActionTypes.USER_ACTION_TYPE:
    changed = _handle_user_evt( payload.action );
    break;
  }

  if( changed ){
    Scenes.emit( 'SCENE-UPDATE' );
  }
});
