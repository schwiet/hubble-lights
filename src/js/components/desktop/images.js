'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import Dispatcher from 'hubble-lights/dispatcher/app-dispatcher';

class Images extends React.Component{

  render(){

    let imgs = [], imgId, img, imgElem, that = this;

    for( imgId in this.props.images ){
      if( this.props.images.hasOwnProperty( imgId )){

        img = this.props.images[ imgId ];
        imgElem = (
          <div className='desk-layout-image-entry'
               key={imgId}
               style={{
                 width: img.width,
                 height: img.height
               }}>
            <div className='desk-layout-image'
                 style={{
                   backgroundImage: 'url(file://'+img.path+')',
                   backgroundSize: "100% 100%"
                 }}
                 onClick={
                   Dispatcher.UserActions.editSceneImg.bind(
                     Dispatcher.UserActions,
                     this.props.selectedScene,
                     this.props.selectedFixture,
                     imgId )
                 }></div>
           </div>
        );
        imgs.push( imgElem );
      }
    }
    
    return(
      <div className='desk-layout-images'>
        {imgs}
      </div>
    );
  }
};

Images.propTypes = {
  images: PropTypes.object.isRequired,
  selectedScene: PropTypes.string.isRequired,
  selectedFixture: PropTypes.string.isRequired
};

module.exports = Images;
