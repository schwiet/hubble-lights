'use strict';'use strict';

var Dispatcher   = require( 'hubble-lights/dispatcher/app-dispatcher' ),
    Constants    = require( 'hubble-lights/constants' ),
    Config;

// STATE

// FUNCTIONS

//////////////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////////////
var ConfigManager = { };

module.exports = ConfigManager;

//////////////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////////////

try{
  Config = require( 'hubble-lights/config/hubble-config.json' );

  Config.scenes.forEach( function( scene ){

    Dispatcher.handleUserAction({
      type: Constants.UserEvents.SCENE_ADDED,
      scene: scene });
  });

  Config.fixtures.forEach( function( fixture ){

    Dispatcher.handleUserAction({
      type: Constants.UserEvents.FIXTURE_EDIT_NAME,
      comName: fixture.comName,
      userName: fixture.userName });
  });
}
catch( e ){
  console.log( 'DEBUG - Config Manager: Config File Does Not Exist!' );
  Dispatcher.handleAppAction( { type: Constants.AppEvents.CONFIG_LOADED } );
}

ConfigManager.dispatchToken = Dispatcher.register( function( payload ){

  switch( payload.type ){

  }
});
