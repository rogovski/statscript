/*
 * there are 12 cars crossing a bridge per unit time t on average
 *
 * The probability of having 16 or less cars crossing the bridge in a particular interval t:
 * cumulative (poisson 12) 16
 * >> 0.8987089925601622
 *
 * The probability of having 17 or more cars crossing the bridge in a particular interval t:
 * complCumulative (poisson 12) 16
 * >> 0.10129100743983777
 *
 **/

'use strict';

var _ss       = require('../utility/collection.js'),
    number    = require('../utility/number.js'),
    _         = require('underscore'),
    polyn     = require('../numeric/polynomial.js'),
    gamma     = require('../numeric/gamma.js'),
    constant  = require('../numeric/constants.js'),
    factorial = require('../numeric/factorial.js');

function _PD(lambda) {
    this.lambda = lambda;
}


function _poisson (lambda) {
    return new _PD(lambda);
}
exports.poisson = _poisson;


function _cdf(distribution,x) {
    if( !(distribution instanceof _PD) ) {
        throw new Error(
            "statscript.distribution.poisson.cdf: " +
            "distribution parameter is not Poisson"
        );
    };

    // if @distribution is the only parameter
    // partially apply the cdf function to it
    if(_.isUndefined(x)) {
        return function (x) {
            if(x < 0) return 0;
            if(!isFinite(x)) return 1;
            if(isNaN(x)) throw new Error("statscript.distribution.poisson.cumulative: NaN input");
            return 1 - gamma.incompleteGamma((Math.floor(x) + 1), distribution.lambda);
        };
    }

    if(x < 0) return 0;
    if(!isFinite(x)) return 1;
    if(isNaN(x)) throw new Error("statscript.distribution.poisson.cumulative: NaN input");
    return 1 - gamma.incompleteGamma((Math.floor(x) + 1), distribution.lambda);
}
exports.cdf = _cdf;


function _complCdf(distribution,x) {
    if( !(distribution instanceof _PD) ) {
        throw new Error(
            "statscript.distribution.poisson.complCdf: " +
            "distribution parameter is not Poisson"
        );
    };

    // if @distribution is the only parameter
    // partially apply the cdf function to it
    if(_.isUndefined(x)) {
        return function (x) {
            return 1 - _cdf(distribution, x);
        };
    }

    return 1 - _cdf(distribution,x);
}
exports.complCdf = _complCdf;


