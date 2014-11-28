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
  ss.number = require('./utility/number.js');

  ss.random = {};
  ss.random.uniform = require('./random/uniform.js');
  ss.random.normal = require('./random/normal.js');

  ss.numeric = {};
  ss.numeric.constants = require('./numeric/constants.js');
  ss.numeric.error = require('./numeric/error.js');
  ss.numeric.kbn = require('./numeric/kbn.js');
  ss.numeric.root = require('./numeric/root.js');
  ss.numeric.chebyshev = require('./numeric/chebyshev.js');
  ss.numeric.gamma = require('./numeric/gamma.js');
  ss.numeric.logarithm = require('./numeric/logarithm.js');
  ss.numeric.beta = require('./numeric/beta.js');
  ss.numeric.combinations = require('./numeric/combinations.js');
  ss.numeric.factorial = require('./numeric/factorial.js');

  ss.distribution = {};
  ss.distribution.normal = require('./distribution/normal.js');

  ss.sample = {};
  ss.sample.collection = require('./sample/collection.js');
  ss.sample.histogram = require('./sample/histogram.js');

  // return the new instance
  return ss;
}

// create a default instance of math.js
var ss = create();

// export the default instance
module.exports = ss;

// nodemon --exec "rebuild.bat" .\rebuild.bat
