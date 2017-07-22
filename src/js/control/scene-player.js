'use strict';

var Dispatcher   = require( 'hubble-lights/dispatcher/app-dispatcher' ),
    Constants    = require( 'hubble-lights/constants' ),
    ConMgr       = require( 'hubble-lights/device/connection-manager' ),
    ImgMgr       = require( 'hubble-lights/util/image-manager' ),
    Blinky       = require( 'hubble-lights/device/blinky' );

// STATE


// FUNCTIONS
var _start_scene, _handle_user_evt;

// only exports for dispatch token
var ScenePlayer = {};
module.exports = ScenePlayer;

//////////////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////////////

_start_scene = function( scene ){

  var comName, blinky, fixture, con, img;

  for( comName in scene.fixtures ){
    if( scene.fixtures.hasOwnProperty( comName ) ){

      fixture = scene.fixtures[ comName ];

      con = ConMgr.getConnection( comName );
      img = ImgMgr.getRGB( fixture.imgId ); 

      blinky = new Blinky( con, img );
    }
  }
};

_handle_user_evt = function( evt ){

  switch( evt.type ){

  case Constants.UserEvents.PLAY_SCENE:
    // TODO: clear current timer
    _start_scene( evt.scene );
    break;
  }
};

ScenePlayer.dispatchToken = Dispatcher.register( function( payload ){

  switch( payload.type ){

  case Dispatcher.ActionTypes.USER_ACTION_TYPE:
    _handle_user_evt( payload.action );
    break;
  }
});
