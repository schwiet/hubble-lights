var readline = require('readline');
var dispatcher = require( 'hubble-lights/dispatcher/app-dispatcher' );
var scenes = require( 'hubble-lights/stores/scenes' );

var scenePlayer = require( 'hubble-lights/control/scene-player' );
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

dispatcher.register( function( payload ){

  console.log( '\n\nEVT:', payload );
});

(function askForScene(){
    rl.question( "What scene number do you want to show? ", function( answer ){

      var scene_list = scenes.getScenes(), scene;

      if( +answer > scene_list.length ){
        console.log("sorry, only have", scene_list.length, "scenes configured" );
      }
      else{
        scene = scene_list[ +answer-1 ];
        dispatcher.UserActions.playScene( scene );
      }
      askForScene();
  });
}());

var config     = require( 'hubble-lights/util/config-manager' );
