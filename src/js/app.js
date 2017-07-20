'use strict';
var serialport = require("serialport");
var Blinky     = require( 'hubble-lights/device/blinky' );
var ImgLoader  = require( 'hubble-lights/image-loader' );
var Config     = require( 'hubble-lights/light-config.json' );
var Hub        = require( 'hubble-lights/event-hub' );

// functions
var _scene_loaded, _evt_handler, _setup_scene, _run_animation;

var _connected_fixtures = [], _scenes_to_load = 0,
    _scenes_loaded = 0, _animation_timer,
    _blinkies = [];

console.log( "------------------------\n"+
             "Welcome to Hubble Lights\n"+
             "------------------------" );

console.log( "Configurations found for:" );
for( var fixture in Config.fixtures ){
  console.log( '\t' + fixture );
}
console.log( '\n' );

console.log( 'scanning for connected Blinky lights...' );
serialport.list( function ( err, ports ) {

  ports.forEach( function( port, index ) {

    var blinky;
    console.log( '\n\nSERIAL INFO:', port, '\n\n\n\n');
    // take advantage of the fact that the manufacturer field is populated
    if( port.manufacturer === 'Blinkinlabs' ){

      blinky = { comName: port.comName };

      // only connect to light if we have a configutaion for it
      if( !Config.fixtures[ port.comName ] ){

        console.log( "ERR: found", port.comName, 'but have no config for it' );
        blinky.configured = false;
      }

      // a config exists for it, go ahead and connect, then read in images
      // for configured scenes
      else{

        // connect to blinky device
        var blink = Blinky( port.comName );
        blink.on( "CONNECTED", function(){

          var scene, path_to_img;

          // keep a list of the names of the connected fixtures for
          // simplified iteration later
          _connected_fixtures.push( port.comName );

          // keep ref to the connected blinky
          Config.fixtures[ port.comName ].blinky = blink;

          //
          path_to_img = Config[ 'image-path' ]+port.comName+'/';

          // get the image corresponding to each scene
          for( scene in Config.fixtures[ port.comName ].scenes ){

            // increment the number of
            _scenes_to_load += 1;

            // load the scenes defined for this blinky
            ImgLoader.getFramesFrom(
              path_to_img,
              scene,
              _scene_loaded.bind( null, port.comName, scene ) );
          }
        });

        blinky.configured = true;
      }

      _blinkies.push( blinky );
      console.log ( "\n\n\nADDED A BLINKY!", blinky );
    }else{
      console.log( 'NOTE: also found - ', port );
    }
  });
});

// special case where there is nothing to initailize... so call it done.
if( _scenes_to_load === 0 ){
  Hub.setInitialized( _blinkies );
}


/**
 * Called when an image file has been loaded into memory for the given
 * fixture and scene
 */
_scene_loaded = function( fixture, scene, frames ){

  Config.fixtures[ fixture ].scenes[ scene ].frames = frames;

  console.log( "Scene loaded:", scene );

  _scenes_loaded += 1;

  if( _scenes_to_load === _scenes_loaded ){
    Hub.setInitialized( _blinkies );
    // now that everything is initialized, start listening to set up scenes
    Hub.addListener( _evt_handler );
  }
};

_evt_handler = function( evt ){
  switch( evt.event ){

    case Hub.Events.SCENE_EVT:
      _setup_scene( evt.scene );
    break;
  }
};

_setup_scene = function( sceneNum ){

  var key, fixture, blinky, scene, i = 0;

  if( _animation_timer ){
    clearTimeout( _animation_timer );
  }

  // load each the correct scene for each fixture
  for( key in Config.fixtures ){

    fixture = Config.fixtures[ key ];

    blinky = fixture.blinky;

    scene = fixture.scenes[ 'scene-'+sceneNum ];

    if( scene ){

      blinky.loadScene( scene.frames, scene.interval, scene.repeat );
    }
    else{
      console.log('ERR: NO Scene', sceneNum, 'in', key );
    }
  }

  _run_animation();
};

_run_animation = function(){

  var i = 0, pending_frames = 0, tick_num = 0, fixture, frame_done, push_frame;

  frame_done = function(){
    pending_frames -= 1;

    // if each of the fixtures has drawn the frame, do the next
    if( pending_frames === 0 ){
      _animation_timer = setTimeout( push_frame, 20 );
    }
    else{

    }
  };

  (push_frame = function(){
    for( i = 0; i < _connected_fixtures.length; i += 1 ){

      fixture = Config.fixtures[ _connected_fixtures[ i ] ];
      pending_frames += 1;
      fixture.blinky.showFrame( tick_num, frame_done );
    }

    // TODO: this needs to cycle on highest common multiple
    tick_num += 1;
    if( tick_num >= Number.MAX_SAFE_INTEGER ){
      tick_num = 0;
    }
  })();
};

// var i = 0;
// blink.loadScene( frames );
// (function draw_next(){
//   setTimeout( function(){
//     blink.showFrame( i++, draw_next );
//   }, 16 );
// }());

// var x = 0;
// var timeout_tester = function run_again(){
//
//   console.log( x, x, x );
//   x += 1;
//   setTimeout( run_again, 30 );
// };
//
// timeout_tester();
