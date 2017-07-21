'use strict';

var Dispatcher   = require( 'hubble-lights/dispatcher/app-dispatcher' ),
    EventEmitter = require( 'events' ).EventEmitter,
    Constants    = require( 'hubble-lights/constants' );

var _handle_user_evt, _has_scene;

var _scenes = [];

/////////////////////////////////////////////////////////////////
//
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
   */
  getScenes: function(){

    return _scenes;
  }
});

module.exports = Scenes;

/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////

_has_scene = function( scene_name ){

  return _scenes.some( function( scene ){

    return scene.name === scene_name;
  });
};

_handle_user_evt = function( evt ){

  var changed = false;

  switch( evt.type ){

  case Constants.UserEvents.SCENE_ADDED:

    // check that the scene has a name and that we don't
    // already have a scene by that name
    // TODO: may want to have more thorough validation
    //       of the scene object
    if( evt.scene.name && !_has_scene( evt.scene.name ) ){

      _scenes.push( evt.scene );
    }
    changed = true;
    break;
  }

  return changed;
};

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
