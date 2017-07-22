var keymirror = require( 'keymirror' );

module.exports = {

  DeviceEvents: keymirror({
    BLINKY_DISCOVERED:   null,
    BLINKY_CONNECTED:    null,
    BLINKY_DISCONNECTED: null
  }),

  UserEvents: keymirror({
    SCENE_ADDED:        null,
    SCENE_EDIT_NAME:    null,
    SCENE_EDIT_RATE:    null,
    SCENE_EDIT_FIXTURE: null,

    PLAY_SCENE: null
  }),

  AppEvents: keymirror({
    IMAGE_LOADED: null
  })
};
