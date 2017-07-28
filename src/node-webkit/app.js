//var Hub       = require( 'hubble-lights/event-hub' );
//var HubbleApp = require( 'hubble-lights/app' );

var bl_menu, menu;

//Hub.addListener( function( evt ){
//  switch( evt.event ){
//    case Hub.Events.INITIALIZED:
//
//      evt.blinkies.forEach( function( blinky ){
//
//        console.log( "adding blinky menu:", blinky );
//
//        bl_menu.append( new nw.MenuItem({ label: (
//            blinky.comName + ( blinky.configured ? '' : ' ( no config )' )
//        )}));
//      });
//    break;
//  }
//});


// Create a shortcut with |option|.
var shortcut = new nw.Shortcut({
  key : "9",
  active : function() {
    Hub.setScene( 1 );
  },
  failed : function(msg) {
    // :(, fail to register the |key| or couldn't parse the |key|.
    console.log(msg);
  }
});

nw.App.registerGlobalHotKey(shortcut);

var shortcut = new nw.Shortcut({
  key : "8",
  active : function() {
    Hub.setScene( 2 );
  },
  failed : function(msg) {
    // :(, fail to register the |key| or couldn't parse the |key|.
    console.log(msg);
  }
});

// Register global desktop shortcut, which can work without focus.
nw.App.registerGlobalHotKey(shortcut);

// Create an empty menubar
menu = new nw.Menu( {type: 'menubar'} );

bl_menu = new nw.Menu();

// Create and append the 1st level menu to the menubar
menu.createMacBuiltin("Hubble Lights");

menu.append( new nw.MenuItem({
  label: 'Blinkies',
  submenu: bl_menu
}));

// nw.Window.get().menu = menu;


// Unregister the global desktop shortcut.
// nw.App.unregisterGlobalHotKey(shortcut);

nw.Window.open( 'index.html', {}, function(win){
  console.log("loaded" );
//  win.hide();
//  win.showDevTools();
  win.menu = menu;
  win.resizeTo( 800, 600 );
});
