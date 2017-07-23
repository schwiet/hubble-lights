'use strict';

var Dispatcher   = require( 'hubble-lights/dispatcher/app-dispatcher' ),
    EventEmitter = require( 'events' ).EventEmitter,
    Constants    = require( 'hubble-lights/constants' );

var _handle_dev_evt, _handle_user_evt, _add_if_new;

var _devices = [],
    _dev_indices = {};
/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////

var BlinkyManager = Object.assign( {}, EventEmitter.prototype, {

  /*
   * Adds a listener for change events on this store. The
   * provided callback will be invoked each time this store's
   * state changes
   *
   * @param callback - function to be invoked on state change
   * @return a function to remove listener
   */
  addListener: function( callback ){

    this.on( 'BLINKY-UPDATE', callback );

    return this.removeListener.bind( this, 'BLINKY-UPDATE', callback );
  },

  /*
   * a method for retrieving device objects.
   *
   * @parm id - the unique identifier of the device; a string
   * @return the device object, if found. Otherwise, null.
   */
  getDevice: function( id ){

    var result = null;

    if( typeof _dev_indices[ id ] === 'number' ){

      result = _devices[ _dev_indices[ id ] ];
    }

    return result;
  },

  getDevices: function(){

    return _devices;
  }
});

module.exports = BlinkyManager;

/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////

_add_if_new = function( comName, name ){

  var changed = false, blinky;
  // if we don't already have an instance for this port
  if( typeof _dev_indices[ comName ] !== 'number' ){

    // add the blinky to the list and note the index for easy lookup
    // TODO: it may be that we only want to note the Blinky and not
    //       create it. 
    blinky = {
      comName: comName,
      name: name,
      isConnected: false
    };
    _devices.push( blinky );
    _dev_indices[ comName ] = _devices.length - 1;
    changed = true;
  }
  else{
   
    console.log( 'DEBUG: already knew about', comName );
  }

  return changed;
};

_handle_user_evt = function( evt ){

  var changed = false;

  switch( evt.type ){

  case Constants.UserEvents.FIXTURE_EDIT_NAME:

    changed = _add_if_new( evt.comName, evt.userName );
    break;
  }

  return changed;
};

_handle_dev_evt = function( evt ){

  var blinky, changed = false;

  switch( evt.type ){
    
  case Constants.DeviceEvents.BLINKY_DISCOVERED:

    changed = _add_if_new( evt.comName ); 
    break;

  case Constants.DeviceEvents.BLINKY_CONNECTED:

    if( typeof _dev_indices [ evt.comName ] === 'number' ){

      blinky = _devices[ _dev_indices[ evt.comName ] ];
      blinky.isConnected = true;
      changed = true;
    }
    break;
  case Constants.DeviceEvents.BLINKY_DISCONNECTED:

    if( typeof _dev_indices [ evt.comName ] === 'number' ){

      blinky = _devices[ _dev_indices[ evt.comName ] ];
      blinky.isConnected = false;
      changed = true;
    }
    break;
  }

  return changed;
};

BlinkyManager.dispatchToken = Dispatcher.register( function( payload ){

  var _changed = false;

  switch( payload.type ){
    
  case Dispatcher.ActionTypes.DEVICE_ACTION_TYPE:
    console.log( "DEVICE ACTION!", payload.action );
      _changed = _handle_dev_evt( payload.action );
    break;
  case Dispatcher.ActionTypes.USER_ACTION_TYPE:
      _changed = _handle_user_evt( payload.action );
    break;
  }

  if( _changed ){
    BlinkyManager.emit( 'BLINKY-UPDATE' );
  }
});
