#!/bin/bash
echo Cleaning dist/ directory
mkdir -p dist/
rm -r dist/*
# cp src/js/light-config.json nwjs/js/
cp src/index.html dist/index.html
# cp -r fixtures/* nwjs/fixtures/ #temporary
cat src/styles/app-styles.css src/styles/**/*.css > dist/styles.css
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
# cp -r node_modules/* nwjs/node_modules/
# symlink source code into node_modules so require()s work
ln -snF ../src/js node_modules/hubble-lights
ln -snF ../example_config node_modules/hubble-config
echo done cleaning...
