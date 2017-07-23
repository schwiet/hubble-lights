'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';


class Scenes extends React.Component{

  render(){

    let scenes = this.props.scenes.map( ( scene, index ) => {

      return(
        <div key={index}></div>
      );
    });

    return(
      <div className='desktop-scenes'>
        {scenes}
      </div>
    );
  }
};

Scenes.propTypes = {
  scenes: PropTypes.array.isRequired
};

module.exports = Scenes;
