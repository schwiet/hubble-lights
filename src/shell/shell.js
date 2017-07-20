// TODO: this is way for newer versions of Electron
// var Electron = require( 'electron' );
// var app = Electron.app;  // Module to control application life.
// var BrowserWindow = Electron.BrowserWindow;  // Module to create native browser window.
// var globalShortcut = Electron.globalShortcut;

// TODO: this is way for old Electron, but I am using it because the newer
//       version has issues with setTimeout
// var app = require( 'app' );
// var BrowserWindow = require( 'browser-window' );
// var globalShortcut = require( 'global-shortcut' );

// var Hub       = require( 'hubble-lights/event-hub' );
// var HubbleApp = require( 'hubble-lights/app' );

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
// var mainWindow = null;

// Quit when all windows are closed.
// app.on('window-all-closed', function() {
//   if (process.platform != 'darwin') {
//     app.quit();
//   }
// });

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
// app.on('ready', function() {
  // Create the browser window.
  // mainWindow = new BrowserWindow({width: 400, height: 400});
  // console.log( mainWindow );

  // and load the index.html of the app.
  // mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the devtools.
  // mainWindow.openDevTools();

  // var ret = globalShortcut.register( '9', function(){
  //   Hub.setScene( 1 );
  // });
  //
  // if( !ret ){
  //   console.log( "ERRRRRR, that didn't work!" );
  // }

  var x = 0;
  var timeout_tester = function run_again(){

    console.log( x, Date.now() );
    x += 1;
    setTimeout( run_again, 30 );
  };

  timeout_tester();
// });
