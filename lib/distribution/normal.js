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


}).call(this);
