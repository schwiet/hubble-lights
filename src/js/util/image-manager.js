'use strict';

var Dispatcher   = require( 'hubble-lights/dispatcher/app-dispatcher' ),
    Constants    = require( 'hubble-lights/constants' ),
    Jimp         = require( 'jimp' );

// STATE
var _img_buffers = {};

// FUNCTIONS
var _handle_user_evt, _skim_scene, _load_img;

//////////////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////////////
var ImageManager = {
  
  getRgbFrames: function( img_name ){
    return _img_buffers[ img_name ] || null;
  },

  IMG_PATH: 'images/'
};
module.exports = ImageManager;

//////////////////////////////////////////////////////////////////
// PRIVATE IMPLEMENTATION
//////////////////////////////////////////////////////////////////


_load_img = function( filename ){

  Jimp.read( ImageManager.IMG_PATH + filename ).then( function( img ){

    var frames = [], frame, pix,
        total_expected = img.bitmap.width * img.bitmap.height;

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

      if( idx === total_expected ){

        Dispatcher.handleAppAction({
          type: Constants.AppEvents.IMAGE_LOADED,
          img: filename
        });
      }

      _img_buffers[ filename ] = frames;
    });
  }).catch( function( err ){

    console.log( "ERR - Image Manager: could not load image:", filename, err );
  });

};

_skim_scene = function( scene ){

  var comName, fixture;

  for( comName in scene.fixtures ){
    if( scene.fixtures.hasOwnProperty( comName ) ){

      fixture = scene.fixtures[ comName ];
      if( ! _img_buffers[ fixture.imgId ] ){

        _img_buffers[ fixture.imgId ] = 'pending...';
        _load_img( fixture.imgId );
       } 
    }
  }
};

_handle_user_evt = function( evt ){

  switch( evt.type ){

  case Constants.UserEvents.SCENE_ADDED:
    _skim_scene( evt.scene );
    break;
  }
};

ImageManager.dispatchToken = Dispatcher.register( function( payload ){

  switch( payload.type ){

  case Dispatcher.ActionTypes.USER_ACTION_TYPE:
    _handle_user_evt( payload.action );
    break;
  }
});
