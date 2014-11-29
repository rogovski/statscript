

'use strict';

var _ss     = require('../utility/collection.js'),
    _       = require('underscore'),
    error   = require('./error.js');


function _RootResult(a) {
    this.notBracketed = false;
    this.searchFailed = _.isUndefined(a) ? true : false;
    this.root = _.isUndefined(a) ? void 0 : a;
}


function ridders (tolerance,f_main,a,fa,b,fb,i) {
    var d    = Math.abs(b - a),
        dm   = (b - a) * 0.5,
        m   = a + dm,
        fm  = f_main(m),
        dn  = Math.sign(fb - fa) * dm * fm / Math.sqrt(fm*fm - fa*fb),
        n   = m - Math.sign(dn) * Math.min(Math.abs(dn), Math.abs(dm) - 0.5 * tolerance),
        fn  = f_main(n);

    if( error.within( a, b ) ) return new _RootResult(a);

    else if (fm === 0) return new _RootResult(m);

    else if (fn === 0) return new _RootResult(n);

    else if (d < tolerance) return new _RootResult(n);

    else if (i >= 100) return new _RootResult();

    else if(n === a || n === b) {
        if(fm*fa < 0) return ridders(tolerance,f_main,a,fa,m,fm,(i+1));

        else return ridders(tolerance,f_main,m,fm,b,fb,(i+1));
    }

    else if(fn*fm < 0) return ridders(tolerance,f_main,n,fn,m,fm,(i+1));

    else if(fn*fa < 0) return ridders(tolerance,f_main,a,fa,n,fn,(i+1));

    else return ridders(tolerance,f_main,n,fn,b,fb,(i+1));
}



// @tolerance: absolute error tolerance
// @lowbound: lower bound of search
// @highbound: upper bound of search
// @fn: function to find the roots of
function _root (tolerance, lowbound, highbound, fn) {
    var flo = fn(lowbound), fhi = fn(highbound);
    if(flo === 0) return new _RootResult(lowbound);

    else if (fhi === 0) return new _RootResult(highbound);

    else if (flo * fhi > 0) {
        var res = new _RootResult();
        res.notBracketed = true;
        return res;
    }
    else return ridders(tolerance, fn, lowbound, flo, highbound, fhi, 0);
}
exports.root = _root;



