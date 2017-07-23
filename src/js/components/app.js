'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import styles from 'styles/app-styles.css';

import Scenes from 'hubble-lights/stores/scenes';
import Fixtures from 'hubble-lights/stores/blinky-manager';

import DesktopLayout from 'hubble-lights/components/desktop/layout';

import 'hubble-lights/util/config-manager';

class HubbleUi extends React.Component {

  constructor(){
    super();
    this.state =  {
      scenes: Scenes.getScenes(),
      fixtures: Fixtures.getDevices()
    }
  }

  componentDidMount(){

    Scenes.addListener( () => {
      this.setState({ scenes: Scenes.getScenes() });
    });

    Fixtures.addListener( () => {
      this.setState({ fixtures: Fixtures.getFixtures() });
    });
  }

  render(){

    //TODO: this would be the place to change the layout
    return(
      <DesktopLayout
        scenes={this.state.scenes}
        fixtures={this.state.fixtures}/>
    );
  }
};

ReactDom.render(
  <HubbleUi></HubbleUi>,
  document.getElementById( 'main' )
);
