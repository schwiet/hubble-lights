'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';

import styles from 'styles/desktop/layout.css';

import Scenes from 'hubble-lights/components/desktop/scenes';

class Layout extends React.Component {

  render(){

    console.log( this.props.scenes );
    return (
      <div className='layout-flex-rows'>
        <div className='desk-layout-scenes'>
        </div>
        <div className='desk-layout-fixtures'>
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
