'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import styles from 'styles/desktop/scenes.css';

import Scene from 'hubble-lights/components/elements/scene';

class Scenes extends React.Component{

  render(){

    console.log("SCENES:", this.props.scenes );
    let scenes = this.props.scenes.map( ( scene, index ) => {
      console.log('drawing scene', scene.name);

      return(
        <div key={index} className='desktop-scenes-entry'>
          <Scene
            scene={scene}
            index={index}/>
        </div>
      );
    });

    return(
      <div className='desktop-scenes layout-flex-columns'>
        {scenes}
      </div>
    );
  }
};

Scenes.propTypes = {
  scenes: PropTypes.array.isRequired
};

module.exports = Scenes;
