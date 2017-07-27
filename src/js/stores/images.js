'use strict';

var Dispatcher   = require( 'hubble-lights/dispatcher/app-dispatcher' ),
    EventEmitter = require( 'events' ).EventEmitter,
    Constants    = require( 'hubble-lights/constants' );

var _handle_app_evt;

var _images = {};


/////////////////////////////////////////////////////////////////
// * IMAGE STORE MODULE *
//
// Keeps track of the paths to image that have been loaded
/////////////////////////////////////////////////////////////////

var ImageStore = Object.assign( {}, EventEmitter.prototype, {

  /*
   * Adds a listener for change events on this store. The
   * provided callback will be invoked each time this store's
   * state changes
   *
   * @param callback - function to be invoked on state change
   * @return a function to remove listener
   */
  addListener: function( callback ){

    this.on( 'IMAGE-UPDATE', callback );

    return this.removeListener.bind( this, 'IMAGE-UPDATE', callback );
  },

  /*
   * returns an object containing info about the loaded images,
   * including path, width and height. key is the filename
   * @return object - the loaded images
   */
  getImages: function(){
    return _images;
  }
});

//////////////////////////////////////////////////////////////////
// PRIVATE IMPLEMENTATION
//////////////////////////////////////////////////////////////////

_handle_app_evt = function( evt ){

  var change = false;

  if( evt.type === Constants.AppEvents.IMAGE_LOADED ){
    _images[ evt.imgId ] = {
      path: evt.imgPath,
      width: evt.width,
      height: evt.height
    };
    change = true;
  }

  return change;
};

module.exports = ImageStore;

// Register for global Dispatched events
ImageStore.dispatchToken = Dispatcher.register( function( payload ){

  var changed = false;

  switch( payload.type ){

  case Dispatcher.ActionTypes.APP_ACTION_TYPE:
    changed = _handle_app_evt( payload.action );
    break;
  }

  if( changed ){
    ImageStore.emit( 'IMAGE-UPDATE' );
  }
});
