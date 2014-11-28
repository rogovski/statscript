(function () {

    'use strict';

    var T        = require('./tuple.js'),
        _        = require('underscore');


    function _sign (x) {
        if(x > 0) return 1;

        if(x < 0) return -1;

        if(x === 0) return 0;
    }

    // takes a real fractional number x and returns a pair (n,f) such that x = n+f
    function _properFraction(x) {

        if(isNaN(x)) return NaN;

        var sign = Math.sign(x), abs_x = Math.abs(x);

        var str_x = abs_x+'';

        if(!_.contains(str_x,'.')){
            return new T.Tuple(sign*parseInt(str_x),0.0);
        }
        else {
            if(str_x[0] === '.') {
                str_x = '0'+str_x;
                return new T.Tuple(0,sign*parseFloat(str_x));
            }

            var splt = str_x.split('.'),
                intpart = parseInt(splt[0]),
                fractpart = parseFloat('0.'+splt[1]),
                intres = intpart === 0 ? 0 : sign*intpart,
                fracres = fractpart === 0 ? 0 : sign*fractpart;

            return new T.Tuple(intres,fracres);
        }
    }
    exports.properFraction = _properFraction;


    function _bd0(x,np) {
        if(!isFinite(x) || !isFinite(np) || np === 0) return NaN;

        if(Math.abs(x_np) >= 0.1 * (x+np)) return x * Math.log(x/np) - x_np;

        var x_np = x - np, v = x_np / (x + np), s0 = x_np * v, ej0  = 2*x*v, vv = v*v;

        var j = 1, ej = ej0*vv, s = s0;

        while(true) {
            var s1 = s + ej/(2*j+1);
            if(s1 == s) return s1;

            j = j+1;
            ej = ej*vv;
            s = s1;
        }
    }
    exports.bd0 = _bd0;

}).call(this);
