
'use strict';

var _ = require('underscore'),
    T = require('./tuple.js');

//(a -> a -> a) -> [a] -> a
function _foldR1 (ls, fn) {
    if(ls.length == 0) throw new Error('foldr1: empty list');

    var acc = ls[0];
    for (var i = 1; i < ls.length; i++) {
        acc = fn( ls[i], acc );
    };
    return acc;
}
exports.foldR1 = _foldR1;

//(a -> b -> b) -> b -> [a] -> b
function _foldR (seed, ls, fn) {
    var acc = seed;
    for (var i = 0; i < ls.length; i++) {
        acc = fn( ls[i], acc );
    };
    return acc;
}
exports.foldR = _foldR;


function _foldL (seed, ls, fn) {
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


function _sum (ls) {
    var accum = 0;
    for (var i = 0; i < ls.length; i++) {
        accum += ls[i];
    };
    return accum;
}
exports.sum = _sum;


//backpermute <a,b,c,d> <0,3,2,3,1,0> = <a,d,c,d,b,a>
function _backpermute (ls, lsIdx) {
    var accum = [];
    for (var i = 0; i < lsIdx.length; i++) {
        accum.push(ls[lsIdx[i]]);
    };
    return accum;
}
exports.backpermute = _backpermute;


// enumFromStepN 1 0.1 5 = <1,1.1,1.2,1.3,1.4>
function _enumFromStepN (from,step,n) {
    var next = from, cnt = 0, accum = [];
    while(cnt < n) {
        accum.push(next);
        next += step;
        cnt++;
    }
    return accum;
}
exports.enumFromStepN = _enumFromStepN;


/**
 * flatten an array of arrays
 **/
function _flatten (lls) {
    var accum = [];
    for (var i = 0; i < lls.length; i++) {
        for (var j = 0; j < lls[i].length; j++) {
            accum.push((lls[i])[j]);
        };
    };
    return accum;
}
exports.flatten = _flatten;


/**
 * a variation ECMAscript slice that uses length
 * instead of index to generate the subarray
 **/
function _slice1(ls,start,len) {
    return ls.slice(start, start+len);
}
exports.slice1 = _slice1;


function _for (start,end,fn) {
    for (var i = start; i < end; i++) fn(i);
}
exports.for = _for;


function _rfor (start,end,fn) {
    for (var i = start-1; i >= end; i--) fn(i);
}
exports.rfor = _rfor;


function _imap (ls,fn) {
    var accum = [];
    for (var i = 0; i < ls.length; i++) {
        accum.push(fn(i,ls[i]));
    };
    return accum;
}
exports.imap = _imap;