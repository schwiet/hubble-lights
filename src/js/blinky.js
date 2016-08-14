var serialport   = require("serialport");
var SerialPort   = serialport.SerialPort;
var EventEmitter = require('events').EventEmitter;
var assign       = require( 'object-assign' );

var _gen_pixel;

var apply_msg = new Buffer( 3 );
apply_msg[ 0 ] = 0;
apply_msg[ 1 ] = 0;
apply_msg[ 2 ] = 255;

var Blinky = function( port ){

  var api, connection;

  var _frames = [];

  /*
   * The Object returned to the client
   */
  api = assign({

    loadScene: function( frames, interval, repeat ){
      _frames = frames;
    },

    showFrame: function( frameIndex, callback ){
      var modded_frame = frameIndex % _frames.length;
      var frame = _frames[ modded_frame ];
      // console.log( "SENDING:", frame );
      connection.write( Buffer.concat( frame ) );
      connection.write( apply_msg, callback );
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
