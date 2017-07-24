'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
//import styles from 'styles/desktop/scenes.css';

import Scene from 'hubble-lights/components/elements/scene';

class Scenes extends React.Component{

  render(){

    var that = this;
      console.log( 'selected!', this.props.selectedScene );

    console.log("SCENES:", this.props.scenes );
    let scenes = this.props.scenes.map( ( scene, index ) => {

      var class_text = 'desktop-scenes-entry';

      if( scene.name === that.props.selectedScene ){
        
        class_text = 'desktop-scenes-entry selected';
      }

      return(
        <div key={index} className={class_text}>
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
  scenes: PropTypes.array.isRequired,
  selectedScene: PropTypes.string
};

module.exports = Scenes;
