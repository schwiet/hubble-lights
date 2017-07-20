#!/bin/bash
echo Cleaning shell/ directory
mkdir -p shell/
rm -r shell/*
mkdir -p shell/js/
mkdir -p shell/fixtures/
mkdir -p shell/node_modules/
cp src/shell/index.html shell/index.html
cp src/shell/shell.js shell/
cp src/light-config.json shell/js/
cp -r fixtures/* shell/fixtures/ #temporary
# cp src/assets/* shell/assets/
cp package.json shell/

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
cp -r node_modules/* shell/node_modules/
# symlink source code into node_modules so require()s work
ln -snF ../js shell/node_modules/hubble-lights
echo done cleaning...
