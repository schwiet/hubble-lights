var Jimp = require("jimp");

var ImgLoader = {

  getFramesFrom: function( pathToImg, sceneName, callback ){

    Jimp.read( pathToImg+sceneName+'.jpg' ).then( function( img ){

      var frames = [], frame, pix;

      img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
        // x, y is the position of this pixel on the image
        // idx is the position start position of this rgba tuple in the bitmap Buffer
        // this is the image

        // make sure there's an array for the frame
        frame = frames[ x ];
        if( !frame ){
          frame = [];
          frames[ x ] = frame;
        }

        // store the RGB values in a Buffer
        pix = new Buffer( 3 );
        pix[ 0 ] = Math.min( this.bitmap.data[ idx + 0 ], 254 );
        pix[ 1 ] = Math.min( this.bitmap.data[ idx + 1 ], 254 );
        pix[ 2 ] = Math.min( this.bitmap.data[ idx + 2 ], 254 );

        // add pixel to frame
        frame.push( pix );
      });

      callback( frames );
    }).catch( function( err ){

      console.log( 'ERR: could not load image: ', pathToImg, err );
    });
  }
};

module.exports = ImgLoader;
