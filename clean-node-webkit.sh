#!/bin/bash
echo Cleaning nwjs/ directory
mkdir -p nwjs/
rm -r nwjs/*
mkdir -p nwjs/js/
mkdir -p nwjs/fixtures/
mkdir -p nwjs/node_modules/
mkdir -p nwjs/assets/
cp src/node-webkit/app.js nwjs/
# cp src/js/light-config.json nwjs/js/
cp src/shell/index.html nwjs/index.html
cp -r fixtures/* nwjs/fixtures/ #temporary
cp -r src/js/* nwjs/js/
cp src/assets/* nwjs/assets/
cp package.json nwjs/

# copy third-party dependencies
# cp -r node_modules/keymirror shell/node_modules/
# cp -r node_modules/object-assign shell/node_modules/
# cp -r node_modules/events shell/node_modules/
# cp -r node_modules/jimp shell/node_modules/
# cp -r node_modules/serialport shell/node_modules/
#
# cp -r node_modules/debug shell/node_modules/
# cp -r node_modules/ms shell/node_modules/
# cp -r node_modules/object.assign shell/node_modules/
# cp -r node_modules/define-properties shell/node_modules/
# cp -r node_modules/object-keys shell/node_modules/
# cp -r node_modules/foreach shell/node_modules/
# cp -r node_modules/function-bind shell/node_modules/
# cp -r node_modules/bindings shell/node_modules/
# cp -r node_modules/pngjs shell/node_modules/
# cp -r node_modules/jpeg-js shell/node_modules/
# cp -r node_modules/bmp-js shell/node_modules/
# cp -r node_modules/mime shell/node_modules/
# cp -r node_modules/tinycolor2 shell/node_modules/
# cp -r node_modules/stream-to-buffer shell/node_modules/
# cp -r node_modules/stream-to shell/node_modules/
cp -r node_modules/* nwjs/node_modules/
# symlink source code into node_modules so require()s work
ln -snF ../js nwjs/node_modules/hubble-lights
echo done cleaning...
