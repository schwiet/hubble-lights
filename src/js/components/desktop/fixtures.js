'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import Dispatcher from 'hubble-lights/dispatcher/app-dispatcher';
//import styles from 'styles/desktop/fixtures.css';

class Fixtures extends React.Component{

  render(){

    let img_path, that = this, clickImg;

    console.log("FIXTURES:", this.props.fixtures );
    let fixtures = this.props.fixtures.map( ( fixture, index ) => {

      var _debug_class='test!';
      var img_style = {
        backgroundSize: "100% 100%",
        backgroundRepeat: "repeat"
      };
      if( that.props.selectedScene ){

        clickImg = () => {
          Dispatcher.UserActions.selectFixture( fixture.comName );
          Dispatcher.UserActions.showImages();
        };

        console.log( that.props.images, that.props.selectedScene);
        img_path = that.props.images[
          that.props.selectedScene.fixtures[ fixture.comName ].imgId
        ].path;

        img_style.backgroundImage = 'url(file://'+img_path+')';
        _debug_class = img_path;
      }

      return(
        <div key={index} className='desktop-fixture-entry'
             onClick={()=>{
               var scene = {
                 name: ('show-' + fixture.name),
                 rate: 20,
                 fixtures: {}};

               scene.fixtures[ fixture.comName ] = {
                 skipCount: 0,
                 loop: true,
                 imgId: 'show-fixture.jpg'
               };
               Dispatcher.UserActions.playScene( scene );
             }}>
          <div className='fixture-name'>
            <h2 className={_debug_class}>Light {index+1}</h2>
            <h3>{fixture.name}</h3>
          </div>
          <div className='fixture-config'>
          </div>
          <div className='fixture-img-container'>
            <div className='fixture-img'
                 style={img_style}
                 onClick={clickImg}>
            </div>
          </div>
        </div>
      );
    });

    return(
      <div className='desktop-fixtures layout-flex-columns'>
        {fixtures}
      </div>
    );
  }
};

Fixtures.propTypes = {
  images:        PropTypes.object.isRequired,
  fixtures:      PropTypes.array.isRequired,
  selectedScene: PropTypes.object
};

module.exports = Fixtures;
