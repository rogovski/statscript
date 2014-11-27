(function () {

    'use strict';

    var _ss      = require('../utility/collection.js'),
        _        = require('underscore'),
        error    = require('../numeric/error.js'),
        constant = require('../numeric/constants.js');


    function _ND(mean, stdDev) {
        if(stdDev <= 0) {
            throw new Error(
                "Statscript.Distribution.Normal: " +
                "standard deviation must be positive"
            );
        }

        this.mean = mean;
        this.stdDev = stdDev;
        this.pdfDenom = Math.log( constant.sqrt_2_pi * stdDev );
        this.cdfDenom = constant.sqrt_2 * stdDev;
    }


    function _standard () {
        return new _ND(0,1);
    }
    exports.standard = _standard;


    function _normal (mean, stdDev) {
        return new _ND(mean, stdDev);
    }
    exports.normal = _normal;


    function _cdf (distribution, probability) {
        if( !(distribution instanceof _ND) ) {
            throw new Error(
                "statscript.distribution.normal.cdf: " +
                "distribution parameter is not Normal"
            );
        };

        // if @distribution is the only parameter
        // partially apply the cdf function to it
        if(_.isUndefined(probability)) {
            return function (p) {
                return error.erfc((d.mean - p) / d.cdfDenom) / 2;
            }
        }

        return error.erfc((d.mean - probability) / d.cdfDenom) / 2;
    }
    exports.cdf = _cdf;


    function _complCdf (distribution, probability) {
        if( !(distribution instanceof _ND) ) {
            throw new Error(
                "statscript.distribution.normal.complCdf: " +
                "distribution parameter is not Normal"
            );
        };

        // if @distribution is the only parameter
        // partially apply the cdf function to it
        if(_.isUndefined(probability)) {
            return function (p) {
                return error.erfc((p - d.mean) / d.cdfDenom) / 2;
            }
        }

        return error.erfc((probability - d.mean) / d.cdfDenom) / 2;
    }
    exports.complCdf = _complCdf;


    function _quantile(dist,p) {
        if(p === 0) return - Infinity;

        if(p === 1) return Infinity;

        if(p === 0.5) return dist.mean;

        if(p > 0 && p < 1) {
            var x = - error.invErfc(2 * p);
            return x * dist.cdfDenom + dist.mean;
        }

        throw new Error("statistics.distribution.normal.quantile: p must be in [0,1] range.");
    }
    exports.quantile = _quantile;


    function _logDensity(dist,x) {
        var xm = x - dist.mean, sd = dist.stdDev;
        return (-xm * xm / (2 * sd * sd)) - dist.pdfDenom;
    }
    exports.logDensity = _logDensity;


    function _density(distribution,x) {
        if( !(distribution instanceof _ND) ) {
            throw new Error(
                "statscript.distribution.normal.density: " +
                "distribution parameter is not Normal"
            );
        };

        // if @distribution is the only parameter
        // partially apply the density function to it
        if(_.isUndefined(x)) {

            return function (p) {
                return Math.exp(_logDensity(distribution,p));
            }
        }

        return Math.exp(_logDensity(distribution,x));
    }
    exports.density = _density;


    function _findRoot(dist,prob,initGuess,lower,upper) {
        var accuracy = 1e-15, maxIters = 150;
        var loop = function (i,dx,x,lo,hi) {
            // base case: return guess
            if(Math.abs(dx) <= accuracy || i >= maxIters) return x;

            else {
                var err = _cdf(dist,x) - prob, pdf = _density(dist,x);

                var lo1, hi1, dx1, x1, dx2, x2;

                if(err < 0) { lo1 = x; hi1 = hi; }
                else { lo1 = lo; hi1 = x; }

                if(pdf != 0) { dx1 = (err / pdf); x1 = (x-dx); }
                else { dx1 = dx; x1 = x; }

                if(x1 < lo1 || x1 > hi1 || pdf === 0) { var y = (lo1 + hi1) / 2; dx2 = y-x; x2 = y; }
                else { dx2 = dx1; x2 = x1; }

                return loop( (i+1), dx2, x2, lo1, hi1 );
            }
        };

        return loop(0,1,initGuess,lower,upper);
    }
    exports.findRoot = _findRoot;


}).call(this);
