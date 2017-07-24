'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import Dispatcher from 'hubble-lights/dispatcher/app-dispatcher';
import Constants from 'hubble-lights/constants';
//import styles from 'styles/elements/scene.css';

class Scene extends React.Component{

  render(){

    var select = function(){

      Dispatcher.handleUserAction({
        type: Constants.UserEvents.SELECT_SCENE,
        sceneName: this.props.scene.name }); 
    }.bind( this );
    return(
      <div className='element-scene'
           onClick={select}>
        <h3 className='element-scene-number'>
          Scene {this.props.index}
        </h3>
        <h2 className='element-scene-name'>
          {this.props.scene.name}
        </h2>
      </div>
    );
  }
};

Scene.propTypes = {
  scene: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

module.exports = Scene;
