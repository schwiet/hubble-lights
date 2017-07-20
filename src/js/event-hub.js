var EventEmitter = require('events').EventEmitter;
var keymirror    = require( 'keymirror' );
var assign       = require( 'object-assign' );

var _EVT_STR = 'HUBBLE_EVENT';

var Hub = assign( {}, EventEmitter.prototype, {

  Events: keymirror({
    INITIALIZED: null,
    SCENE_EVT: null,
  }),

  addListener: function( callback ){
    this.on( _EVT_STR, callback );
  },

  setInitialized: function( blinkies ){

    this.emit( _EVT_STR, {
      event: this.Events.INITIALIZED,
      blinkies: blinkies
    });
  },

  setScene: function( sceneNum ){
    this.emit( _EVT_STR, {
      event: this.Events.SCENE_EVT,
      scene: sceneNum
    });
  }
});

module.exports = Hub;
