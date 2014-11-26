(function () {

    'use strict';

    var _ss     = require('../utility/collection.js'),
        _       = require('underscore');


    function _Kbn (sum, c) {
        this.sum = sum;
        this.c = c;
    }


    function _kbnAddInternal (kbn_orig, x) {
        var c_orig = kbn_orig.c, sum_orig = kbn_orig.sum;

        var sum2 = sum_orig + c_orig;
        var c2 = null;

        if( Math.abs( sum_orig ) >= Math.abs( x ) )
            c2 = c_orig + ( ( sum_orig - sum2 ) + x );

        else
            c2 = c_orig + ( ( x - sum2 ) + sum_orig );


        return new _Kbn( sum2, c2 );
    }


    // public api

    function _zero () {
        return new _Kbn(0,0);
    }
    exports.zero = _zero;


    function _add (kbn, a) {

        if( !(kbn instanceof _Kbn) ) {
            throw new Error(
                "statscript.numeric.kbn.add: " +
                "kbn parameter is not of type KBN"
            );
        }

        return _kbnAddInternal( kbn, a );
    }
    exports.add = _add;


    function _sum (ls,fn) {
        return fn( _ss.foldL( _zero, ls, _add ) );
    }
    exports.sum = _sum;


    function _unpack (obj) {
        return obj.sum + obj.c;
    }
    exports.unpack = _unpack;

}).call(this);
