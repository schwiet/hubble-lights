'use strict';

var Dispatcher   = require( 'hubble-lights/dispatcher/app-dispatcher' ),
    EventEmitter = require( 'events' ).EventEmitter,
    Constants    = require( 'hubble-lights/constants' );

var _handle_user_evt, _get_scene_by_name;

var _selected_scene = null;

/////////////////////////////////////////////////////////////////
// * CLIENT STATE MODULE *
//
// Scenes keeps track of the runtime state of UI
/////////////////////////////////////////////////////////////////

var ClientState = Object.assign( {}, EventEmitter.prototype, {
  
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
   * returns the currently selected scene's name
   * @return string
   */
  getSelectedScene: function(){

    return _selected_scene;
  }
});

module.exports = ClientState;

/////////////////////////////////////////////////////////////////
// PRIVATE IMPLEMENTATION
/////////////////////////////////////////////////////////////////

_handle_user_evt = function( evt ){

  var changed = false

  switch( evt.type ){

  case Constants.UserEvents.SELECT_SCENE:

    if( evt.sceneName !== _selected_scene ){

      _selected_scene = evt.sceneName;
      changed = true;
    }
    break;
  }

  return changed;
};

// Register for global Dispatched events
ClientState.dispatchToken = Dispatcher.register( function( payload ){

  var changed = false;

  switch( payload.type ){

  case Dispatcher.ActionTypes.USER_ACTION_TYPE:
    changed = _handle_user_evt( payload.action );
    break;
  }

  if( changed ){
    ClientState.emit( 'SCENE-UPDATE' );
  }
});
