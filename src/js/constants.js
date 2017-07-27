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

    FIXTURE_EDIT_NAME: null,
    FIXTURE_EDIT_IMG:  null,

    SELECT_SCENE:      null,
    SELECT_FIXTURE:    null,
    PLAY_SCENE:        null,

    SHOW_IMAGES:       null
  }),

  AppEvents: keymirror({
    IMAGE_LOADED:  null,
    CONFIG_LOADED: null
  })
};
