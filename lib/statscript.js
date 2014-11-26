'use strict';

/**
 * statscript.js factory function.
 */
function create (config) {
  // simple test for ES5 support
  if (typeof Object.create !== 'function') {
    throw new Error('ES5 not supported by this JavaScript engine. ' +
        'Please load the es5-shim and es5-sham library for compatibility.');
  }

  // create namespace
  var ss = {};

  ss.create = create;

  ss.collection = require('./utility/collection.js');

  ss.tuple = require('./utility/tuple.js');

  ss.random = {};
  ss.random.normal = require('./random/normal.js');

  // return the new instance
  return ss;
}

// create a default instance of math.js
var ss = create();

// export the default instance
module.exports = ss;

// nodemon --exec "rebuild.bat" .\rebuild.bat
