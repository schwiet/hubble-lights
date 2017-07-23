'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';

//import styles from 'styles/elements/scene.css';

class Scene extends React.Component{

  render(){

    return(
      <div className='element-scene'>
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
