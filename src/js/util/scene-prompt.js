var readline = require('readline');
var Hub      = require( 'hubble-lights/event-hub' );
var app      = require( 'hubble-lights/app' );

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

Hub.addListener( function( evt ){

  console.log( "EVENT: ", evt);
  switch( evt.event ){
    case Hub.Events.INITIALIZED:
      (function askForScene(){
        rl.question( "What scene number do you want to show? ", function( answer ){

          Hub.setScene( answer );

          askForScene();
        });
      }());
    break;
  }
});
