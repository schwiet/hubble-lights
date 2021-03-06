'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';

//import styles from 'styles/desktop/layout.css';

import Images from 'hubble-lights/components/desktop/images';
import Scenes from 'hubble-lights/components/desktop/scenes';
import Fixtures from 'hubble-lights/components/desktop/fixtures';
import Dispatcher from 'hubble-lights/dispatcher/app-dispatcher';

class Layout extends React.Component {
  
  constructor(){
    super();
    this.promptElem = (
      <div className='desk-layout-selected-scene'>
        <span>
          <h2>Click Above</h2>
          <h3>to configure a scene</h3>
        </span>
      </div>
    );
  }

  render(){

    var currentScene = null, that = this,
        sceneElem = this.promptElem,
        imgsElem  = null,
        topClass = 'layout-flex-rows dark-bg';

    if( this.props.areImagesShowing ){

      imgsElem = (
        <Images
          images={this.props.images}
          selectedScene={this.props.selectedScene}
          selectedFixture={this.props.selectedFixture}/>
      );

      topClass += ' images-showing';
    }

    this.props.scenes.some( ( scene ) => {

      if( scene.name === that.props.selectedScene ){
        currentScene = scene;

        // replace default scene element with one that has scene details
        sceneElem = (
          <div className='desk-layout-selected-scene'>
            <span className='desk-layout-scene-info-elem'>
              <h2>{scene.name}</h2>
              <h3>scene configuration</h3>
            </span>
            <span className='desk-layout-scene-info-elem'>
              <h3>transition</h3>
              <p className='config-value'>NO</p>
            </span>
            <span className='desk-layout-scene-info-elem'>
              <h3>rate</h3>
              <p><span className='config-value'>{scene.rate}</span> ms</p>
            </span>
            <div className='round-button'
                 onClick={Dispatcher.UserActions.playScene.bind( null, scene )}>
              RUN
            </div>
          </div>
        );
        return true;
      }
      return false;
    });

    return (
      <div className={topClass}>
        <div className='desk-layout-scenes lite-bg'>
          <Scenes
            scenes={this.props.scenes}
            selectedScene={this.props.selectedScene}/>
        </div>
        {sceneElem}
        <div className='desk-layout-fixtures '>
          <Fixtures
            fixtures={this.props.fixtures}
            images={this.props.images}
            selectedScene={currentScene}
            selectedFixture={this.props.selectedFixture}/>
        </div>
        <div className='desk-layout-images-overlay translucent'>
          {imgsElem}
        </div>
      </div>
    );
  }
};

Layout.propTypes = {

  images:   PropTypes.object.isRequired,
  scenes:   PropTypes.array.isRequired,
  fixtures: PropTypes.array.isRequired,
  selectedScene: PropTypes.string,
  selectedFixture: PropTypes.string
};

module.exports = Layout;
