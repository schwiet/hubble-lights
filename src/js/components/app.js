'use strict';

import React from 'react';
import ReactDom from 'react-dom';
//import styles from 'hubble-styles/app-styles.css';

import Images from 'hubble-lights/stores/images';
import Scenes from 'hubble-lights/stores/scenes';
import Fixtures from 'hubble-lights/stores/blinky-manager';
import Client from 'hubble-lights/stores/client-state';

import DesktopLayout from 'hubble-lights/components/desktop/layout';

//import 'hubble-lights/util/config-manager';

class HubbleUi extends React.Component {

  constructor(){
    super();
    this.state =  {
      images: Images.getImages(),
      scenes: Scenes.getScenes(),
      fixtures: Fixtures.getDevices(),
      selectedScene: null
    }
  }

  componentDidMount(){

    Images.addListener( () => {
      this.setState({ images: Images.getImages() });
    });

    Scenes.addListener( () => {
      this.setState({ scenes: Scenes.getScenes() });
    });

    Fixtures.addListener( () => {
      this.setState({ fixtures: Fixtures.getDevices() });
    });

    Client.addListener( () => {
      this.setState({
        selectedScene: Client.getSelectedScene()
      });
    });
  }

  render(){

    //TODO: this would be the place to change the layout
    return(
      <DesktopLayout
        images={this.state.images}
        scenes={this.state.scenes}
        fixtures={this.state.fixtures}
        selectedScene={this.state.selectedScene}/>
    );
  }
};

ReactDom.render(
  <HubbleUi></HubbleUi>,
  document.getElementById( 'main' )
);
