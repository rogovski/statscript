(function () {

    'use strict';

    var _ss      = require('../utility/collection.js'),
        _        = require('underscore');


    function _evaluatePolynomial(x,coeffs) {
        if(coeffs.length == 0) return 0;

        return _ss.foldR1(coeffs, function (a,r) {
            return a + r*x;
        });
    }
    exports.evaluatePolynomial = _evaluatePolynomial;


    function _evaluateEvenPolynomial (x,coeffs) {
        return _evaluatePolynomial(x*x,coeffs);
    }
    exports.evaluateEvenPolynomial = _evaluateEvenPolynomial;


    function _evaluateOddPolynomial (x,coeffs) {
        return x * evaluatePolynomial(x*x,coeffs);
    }
    exports.evaluateOddPolynomial = _evaluateOddPolynomial;


}).call(this);
