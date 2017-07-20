var Dispatcher = require( 'flux' ).Dispatcher;                                                                                                                                                          

const _DEVICE_ACTION_TYPE = 'DEVICE-ACTION-TYPE';
const _USER_ACTION_TYPE   = 'USER-ACTION-TYPE';

var _do_dispatch = function( type, action ){

  AppDispatcher.dispatch({
    type: type,
    action: action
  });
};

var AppDispatcher = Object.assign( new Dispatcher(), {

  handleUserAction:    _do_dispatch.bind( null, _USER_ACTION_TYPE ),
  handleDeviceAction:  _do_dispatch.bind( null, _DEVICE_ACTION_TYPE ),

  ActionTypes:{
    DEVICE_ACTION_TYPE: _DEVICE_ACTION_TYPE,
    USER_ACTION_TYPE:  _USER_ACTION_TYPE
  }
});

module.exports = AppDispatcher;
