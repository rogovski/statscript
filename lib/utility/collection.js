(function () {
    'use strict';

    var _ = require('underscore');
    var T = require('./tuple.js');

    function _foldL (fn, seed, ls) {
        var acc = seed;
        for (var i = 0; i < ls.length; i++) {
            acc = fn( acc, ls[i] );
        };
        return acc;
    }
    exports.foldL = _foldL;


    function _unfoldr (seed, generate) {
        var s = seed, accum = [], safety = 35000;

        while(safety > 0) {
            var res = generate(s);
            if(_.isEmpty(res)) { break; }
            else {
              accum.push(res.fst);
              s = res.snd;
            }
            safety--;
        }
        return accum;
    }
    exports.unfoldr = _unfoldr;


    function _unfoldrN (n, seed, generate) {
        var s = seed, accum = [], safety = 35000, idx = 0;

        while(idx < n && safety > 0) {
            var res = generate(s);
            if(_.isEmpty(res)) { break; }
            else {
              accum.push(res.fst);
              s = res.snd;
            }
            safety--;
            idx++;
        }
        return accum;
    }
    exports.unfoldrN = _unfoldrN;


    function _zipWith (xs, ys, fn) {
        var longerList = xs.length > ys.length ? ys : xs,
            accum = [];
        for (var i = 0; i < longerList.length; i++) {
            accum.push( fn( xs[i],ys[i] ) );
        };
        return accum;
    }
    exports.zipWith = _zipWith;


    function _replicate(n, a) {
        var accum = [];
        for (var i = 0; i < n; i++) {
            accum.push(a);
        };
        return accum;
    }
    exports.replicate = _replicate;


    function _generate(n, fn) {
        var accum = [];
        for (var i = 0; i < n; i++) {
            accum.push(fn(i));
        };
        return accum;
    }
    exports.generate = _generate;

}).call(this);