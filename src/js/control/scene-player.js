'use strict';

var Dispatcher   = require( 'hubble-lights/dispatcher/app-dispatcher' ),
    Constants    = require( 'hubble-lights/constants' ),
    ConMgr       = require( 'hubble-lights/device/connection-manager' ),
    ImgMgr       = require( 'hubble-lights/util/image-manager' ),
    Blinky       = require( 'hubble-lights/device/blinky' );

// STATE
var _timer_handle, _current_scene_name;

// FUNCTIONS
var _start_scene, _handle_user_evt;

// only exports for dispatch token
var ScenePlayer = {};
module.exports = ScenePlayer;

//////////////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////////////

_start_scene = function( scene ){

  var blinkies = [],
      index = 1,
      i = 0,
      pending_frames = 0,
      tick_num = 0,
      scene_handle = -1,
      frame_done, push_frame,
      comName, fixture, con, frames, blinky;

  // retrieve the proper connection and img frame data for each
  // fixture
  for( comName in scene.fixtures ){
    if( scene.fixtures.hasOwnProperty( comName ) ){

      fixture = scene.fixtures[ comName ];
      con     = ConMgr.getConnection( comName );
      frames  = ImgMgr.getRgbFrames( fixture.imgId ); 

      if( con && frames ){
        blinkies.push( Blinky( con, frames, fixture.skipCount, fixture.loop ) );
      }
      else{
        console.log( "ERR - Scene Player: Either no connection or no image for ->",
           comName, fixture.imgId ); 
      }
    }
  }

  // re-iterates sequence to draw the next frame
  frame_done = function(){
    pending_frames -= 1;

    // if all of the fixtures have sent their frame info and this animation is
    // still running, do the next
    if( pending_frames === 0 && scene_handle === _timer_handle ){
      _timer_handle = setTimeout( push_frame, scene.rate );
      // keep an internal reference to the timer handle within this closure, so we
      // can tell if it gets cancelled during an async sequence
      scene_handle = _timer_handle;
    }
  };

  // pushes the next frame down to each fixture
  push_frame = function(){

    for( i = 0; i < blinkies.length; i += 1 ){

       blinky = blinkies[ i ];
       pending_frames += 1;
       blinky.showFrame( tick_num, frame_done );
     } 

    // TODO: this should cycle on the highest commone multiple of image lengths
    tick_num += 1;
    if( tick_num >= Number.MAX_SAFE_INTEGER ){
      tick_num = 0;
    }
  };

  push_frame();
};

_handle_user_evt = function( evt ){

  switch( evt.type ){

  case Constants.UserEvents.PLAY_SCENE:
    if( evt.scene.name !== _current_scene_name ){
      // clear current timer, then start new scene
      clearTimeout( _timer_handle );
      _timer_handle = -1; // gets reset to negative integer, since this is not valid
      _start_scene( evt.scene );
    }
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
