'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';

import styles from 'styles/desktop/layout.css';

import Scenes from 'hubble-lights/components/desktop/scenes';
import Fixtures from 'hubble-lights/components/desktop/fixtures';

class Layout extends React.Component {

  render(){

    return (
      <div className='layout-flex-rows'>
        <div className='desk-layout-scenes'>
          <Scenes
            scenes={this.props.scenes}/>
        </div>
        <div className='desk-layout-selected-scene'>
        </div>
        <div className='desk-layout-fixtures'>
          <Fixtures
            fixtures={this.props.fixtures}/>
        </div>
      </div>
    );
  }
};

Layout.propTypes = {

  scenes:   PropTypes.array.isRequired,
  fixtures: PropTypes.array.isRequired
};

module.exports = Layout;
