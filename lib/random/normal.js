(function () {

    'use strict';

    var _ss     = require('../utility/collection.js'),
        _       = require('underscore'),
        uniform = require('./uniform.js'),
        T       = require('../utility/tuple.js');

    var rNorm = 3.442619855899,
        blocks_v = 0.00991256303526217,
        blocks_f = Math.exp(-0.5 * rNorm * rNorm);

    function _blocksUnfoldHelper (seed) {
        var b = seed.fst,
            g = seed.snd,
            h = Math.sqrt( -2 * Math.log( (blocks_v / b) + g ) ),
            u = new T.Tuple(h, Math.exp( -0.5 * h * h ) );

        return new T.Tuple( h, u );
    }

    var _blocks_ls = (function () {
        var seed = new T.Tuple( rNorm, blocks_f ),
            unfoldResult = _ss.unfoldrN( 126, _blocksUnfoldHelper, seed );

        unfoldResult.unshift(rNorm);
        unfoldResult.unshift(blocks_v/blocks_f);
        unfoldResult.push(0);

        return unfoldResult;
    })();
    exports.blocks = _blocks_ls;


    var _ratios_ls = (function () {
        return _ss.zipWith(function (a,b) {return a / b;}, _.rest(_blocks_ls), _blocks_ls);
    })();
    exports.ratios = _ratios_ls;

    function _normalTail (cond) {
        while(true) {
            var x = Math.log(uniform.uniform_Float()) / rNorm,
                y = Math.log(uniform.uniform_Float())

            if(!(y * -2 < x*x)) return (cond ? x - rNorm : rNorm - x);
        }
    }

    function _standard () {
        while(true) {
            var u = (uniform.uniform_Float() * 2) - 1,
                i = (uniform.uniform_Word32 & 127),
                block_i = _blocks_ls[i],
                block_j = _blocks_ls[i+1];

            if(Math.abs(u) < _ratios_ls[i]) return u * block_i;

            if(i == 0) return _normalTail(u < 0);

            var x = u * block_i,
                xx = x * x,
                d = Math.exp(-0.5 * (block_i * block_i - xx)),
                e = Math.exp(-0.5 * (block_j * block_j - xx)),
                c = uniform.uniform_Float();

            if(e+c*(d-e) < 1) return x;
        }
    }
    exports.standard = _standard;


}).call(this);
