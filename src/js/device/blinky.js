'use strict';
var Serialport   = require("serialport");
var EventEmitter = require('events').EventEmitter;
var assign       = Object.assign;

var _gen_pixel;

var apply_msg = new Buffer( 3 );
apply_msg[ 0 ] = 0;
apply_msg[ 1 ] = 0;
apply_msg[ 2 ] = 255;

var Blinky = function( port ){

  var api, connection;

  var _frames = [], _scene_complete = true, _interval = 1, _repeat = true,
      _last_frame_num = -1;

  /*
   * The Object returned to the client
   */
  api = assign({

    loadScene: function( frames, optInterval, optRepeat ){
      _frames = frames;

      // reset animation helpers
      _scene_complete = false;
      _last_frame_num = -1;

      // load interval option or default if none provided
      if( typeof optInterval === 'number' ){
        _interval = optInterval;
      }
      else{
        _interval = 1;
      }

      // load repeat option or default if none provided
      if( typeof optRepeat === 'boolean' ){
        _repeat = optRepeat
      }
      else{
        _repeat = true;
      }

    },

    // TODO: move callback into loadFrame?
    showFrame: function( frameIndex, callback ){

      var modded_frame, frame;

      if( _scene_complete ){
        // do nothing
      }
      else{

        // calculate the frame number
        modded_frame = Math.round( frameIndex / _interval );

        // if it's the last frame and we're not supposed to repeat
        if( !_repeat && modded_frame >= _frames.length ){
          _scene_complete = true;
        }

        // ok to show
        else{

          // wrap the number so it stays within the number of frames
          modded_frame = modded_frame % _frames.length;

          // if it's a new frame, go ahead and draw it
          if( modded_frame !== _last_frame_num ){
            // console.log( modded_frame );
            frame = _frames[ modded_frame ];
            // console.log( "SENDING:", frame );
            connection.write( Buffer.concat( frame ) );
            connection.write( apply_msg, callback );
            _last_frame_num = modded_frame;
          }
          // if that was the same frame as last shown, immediately
          // call the callback
          else{
            callback();
          }
        }
      }
    }
  }, EventEmitter.prototype );

  connection = new SerialPort( port, { baudrate: 115200 });

  connection.on('open', function() {
    console.log( "CONNECTED to ", port );
    api.emit( 'CONNECTED' );
  });

  return api;
};

module.exports = Blinky;
