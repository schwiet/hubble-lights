#!/bin/bash
echo Cleaning nwjs/ directory
mkdir -p nwjs/
rm -r nwjs/*
mkdir -p nwjs/js/
mkdir -p nwjs/styles/
mkdir -p nwjs/config/
mkdir -p nwjs/node_modules/
# cp src/js/light-config.json nwjs/js/
cp src/node-webkit/index.html nwjs/index.html
cp src/node-webkit/app.js nwjs/app.js
cp src/node-webkit/system-loader.js nwjs/system-loader.js
# cp -r fixtures/* nwjs/fixtures/ #temporary
cp example_config/* nwjs/config/
cp package.json nwjs/
cat src/styles/app-styles.css src/styles/**/*.css > nwjs/styles/styles.css

# we are going to copy all of the node modules even though we don't need them all :/
# first, we need to remove symlinks we may have created for development convenience
rm node_modules/hubble-lights
rm node_modules/hubble-config
cp -r node_modules/* nwjs/node_modules/

# finally create our own symlinks for requires
ln -snF ../js nwjs/node_modules/hubble-lights
ln -snF ../config nwjs/node_modules/hubble-config
echo done cleaning...
