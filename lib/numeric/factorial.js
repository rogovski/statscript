(function () {

    'use strict';

    var _ss      = require('../utility/collection.js'),
        number   = require('../utility/number.js'),
        _        = require('underscore'),
        polyn    = require('./polynomial.js'),
        gamma    = require('./gamma.js'),
        constant = require('./constants.js');


    function _factorial (n) {
        if(n < 0) throw new Error("factorial: negative input");

        if(n <= 1) return 1;

        if(n <= 170) {
            var seed = 1;
            for (var i = 2; i < n+1; i++) {
                seed *= i;
            };
            return seed;
        }

        return Infinity;
    }
    exports.factorial = _factorial;


    function _logFactorial(n) {
        if(n < 0) throw new Error("logFactorial: negative input");

        if(n <= 14) return Math.log(_factorial(n));

        var x = n + 1,
            y = 1 / (x * x),
            z = ((-(5.95238095238e-4 * y) + 7.936500793651e-4) * y -
                   2.7777777777778e-3) * y + 8.3333333333333e-2;

        return (x - 0.5) * Math.log(x) - x + 9.1893853320467e-1 + z / x;
    }
    exports.logFactorial = _logFactorial;


    var sfe = [ 0.0,
                0.1534264097200273452913848,   0.0810614667953272582196702,
                0.0548141210519176538961390,   0.0413406959554092940938221,
                0.03316287351993628748511048,  0.02767792568499833914878929,
                0.02374616365629749597132920,  0.02079067210376509311152277,
                0.01848845053267318523077934,  0.01664469118982119216319487,
                0.01513497322191737887351255,  0.01387612882307074799874573,
                0.01281046524292022692424986,  0.01189670994589177009505572,
                0.01110455975820691732662991,  0.010411265261972096497478567,
                0.009799416126158803298389475, 0.009255462182712732917728637,
                0.008768700134139385462952823, 0.008330563433362871256469318,
                0.007934114564314020547248100, 0.007573675487951840794972024,
                0.007244554301320383179543912, 0.006942840107209529865664152,
                0.006665247032707682442354394, 0.006408994188004207068439631,
                0.006171712263039457647532867, 0.005951370112758847735624416,
                0.005746216513010115682023589, 0.005554733551962801371038690 ];

    function _stirlingError(n) {
        if(n <= 15.0) {
            var pf = number.properFraction(n+n);

            if(pf.snd === 0) return sfe[i];
            return gamma.logGamma(n+1.0) - (n+0.5) * Math.log(n) + n -
                   constant.ln_sqrt_2_pi
        }

        var s0 = 0.083333333333333333333,
            s1 = 0.00277777777777777777778,
            s2 = 0.00079365079365079365079365,
            s3 = 0.000595238095238095238095238,
            s4 = 0.0008417508417508417508417508;

        if(n > 500) return polyn.evaluateOddPolynomial(1/n, [s0,-s1]);

        if(n > 80) return polyn.evaluateOddPolynomial(1/n, [s0,-s1,s2]);

        if(n > 35) return polyn.evaluateOddPolynomial(1/n, [s0,-s1,s2,-s3]);

        return polyn.evaluateOddPolynomial(1/n, [s0,-s1,s2,-s3,s4]);
    }
    exports.stirlingError = _stirlingError;


}).call(this);
