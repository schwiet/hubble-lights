'use strict';

var Dispatcher   = require( 'hubble-lights/dispatcher/app-dispatcher' ),
    EventEmitter = require( 'events' ).EventEmitter,
    Blinky       = require( 'hubble-lights/device/blinky' ),
    Constants    = require( 'hubble-lights/constants' );

var _handle_dev_evt;

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

      result = _dev_indices[ id ];
    }

    return result;
  }
});

module.exports = BlinkyManager;

/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////

_handle_dev_evt = function( evt ){

  var blinky, changed = false;

  switch( evt.type ){
    
  case Constants.DeviceEvents.BLINKY_DISCOVERED:

    // if we don't already have an instance for this port
    if( !_dev_indices[ evt.port.comName ] ){

      // add the blinky to the list and note the index for easy lookup
      blinky = Blinky( evt.port.comName );
      _devices.push( blinky );
      _dev_indices[ evt.port.comName ] = _devices.length - 1;
    }
    else{
     
      console.log( 'DEBUG: already knew about', evt.port.comName );
    }
    break;
  
  }

  return changed;
};

BlinkyManager.dispatchToken = Dispatcher.register( function( payload ){

  var _changed = false;

  switch( payload.type ){
    
  case Dispatcher.ActionTypes.DEVICE_ACTION_TYPE:
      _changed = _handle_dev_evt( payload.action );
    break;
  }

  if( _changed ){
    BlinkyManager.emit( 'BLINKY-UPDATE' );
  }
});
