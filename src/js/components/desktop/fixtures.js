'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
//import styles from 'styles/desktop/fixtures.css';

class Fixtures extends React.Component{

  render(){

    console.log("FIXTURES:", this.props.fixtures );
    let fixtures = this.props.fixtures.map( ( fixture, index ) => {
      console.log('drawing fixture', fixture.name);

      return(
        <div key={index} className='desktop-fixture-entry'>
          <h2>Light {index}</h2>
          <h3>{fixture.name}</h3>
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
  fixtures:      PropTypes.array.isRequired,
  selectedScene: PropTypes.object
};

module.exports = Fixtures;
