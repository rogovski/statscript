

'use strict';

var _ss      = require('../utility/collection.js'),
    T        = require('../utility/tuple.js'),
    _        = require('underscore');


function _chebyshev(x,coeffs) {
    var tail = _.rest(coeffs),
        folded = _ss.foldR(new T.Tuple(0,0), tail, function (k,t) {
            var b0 = t.fst, b1 = t.snd;
            return new T.Tuple(k + (x*2) * b0 - b1, b0)
        });

    return _.first(coeffs) + x * folded.fst - folded.snd;
}
exports.chebyshev = _chebyshev;


function _chebyshevBroucke (x,coeffs) {
    var c = coeffs;
    c[0] = c[0]/2;

    return _chebyshev(x,c);
}
exports.chebyshevBroucke = _chebyshevBroucke;



