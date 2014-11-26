(function () {

    'use strict';


    // error function.
    // taken from http://www.johndcook.com/cpp_erf.html
    function _erf(x) {
        var a1 =  0.254829592;
        var a2 = -0.284496736;
        var a3 =  1.421413741;
        var a4 = -1.453152027;
        var a5 =  1.061405429;
        var p  =  0.3275911;

        // Save the sign of x
        var sign = 1;
        if (x < 0)
            sign = -1;

        x = Math.abs(x);

        // A&S formula 7.1.26
        var t = 1.0/(1.0 + p*x);
        var y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-x*x);

        return sign*y;
    }
    exports.erf = _erf;


    function _erfc (x) {
        return 1 - _erf(x);
    }
    exports.erfc = _erfc;


    // mikolalysenko: https://www.npmjs.org/package/almost-equal
    function _within (a,b) {
        var FLT_EPSILON = 1.19209290e-7,
            absoluteError = FLT_EPSILON,
            relativeError = FLT_EPSILON,
            d = Math.abs(a - b);

        if(d <= absoluteError) {
            return true
        }
        if(d <= relativeError * Math.min(Math.abs(a), Math.abs(b))) {
            return true
        }
        return a === b
    }
    exports.within = _within;


}).call(this);
