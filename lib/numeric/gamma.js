(function () {

    'use strict';

    var _ss      = require('../utility/collection.js'),
        _        = require('underscore'),
        error    = require('../numeric/error.js'),
        constant = require('../numeric/constants.js');


    function _logGamma (x) {

        if(x <= 0) return Infinity;

        // Handle positive infinity. logGamma overflows before 1e308 so
        // it's safe
        if(x > 1e308) return Infinity;


        var y = Math.log(x),
            alr2pi = 0.918938533204673,
            k = x * (y-1) - 0.5 * y + alr2pi,
            x1 = 1 / x,
            x2 = x1 * x1;


        var a,b,c;
        if(x < 0.5) { a = -y; b = x+1; c = x; }
        else        { a = 0;  b = x;   c = x-1; }


        var r1_0 = -2.66685511495,    r1_1 = -24.4387534237,     r1_2 = -21.9698958928,
            r1_3 = 11.1667541262,     r1_4 = 3.13060547623,      r1_5 = 0.607771387771,
            r1_6 = 11.9400905721,     r1_7 = 31.4690115749,      r1_8 = 15.2346874070,
            r2_0 = -78.3359299449,    r2_1 = -142.046296688,     r2_2 = 137.519416416,
            r2_3 =  78.6994924154,    r2_4 = 4.16438922228,      r2_5 = 47.0668766060,
            r2_6 = 313.399215894,     r2_7 = 263.505074721,      r2_8 = 43.3400022514,
            r3_0 = -2.12159572323e5,  r3_1 = 2.30661510616e5,    r3_2 = 2.74647644705e4,
            r3_3 = -4.02621119975e4,  r3_4 = -2.29660729780e3,   r3_5 = -1.16328495004e5,
            r3_6 = -1.46025937511e5,  r3_7 = -2.42357409629e4,   r3_8 = -5.70691009324e2,
            r4_0 = 0.279195317918525, r4_1 = 0.4917317610505968, r4_2 = 0.0692910599291889,
            r4_3 = 3.350343815022304, r4_4 = 6.012459259764103;


        // Normal cases
        if(x < 1.5)
            return a + c *
                  ((((r1_4 * b + r1_3) * b + r1_2) * b + r1_1) * b + r1_0) /
                  ((((b + r1_8) * b + r1_7) * b + r1_6) * b + r1_5);

        if(x < 4)
            return (x - 2) *
                  ((((r2_4 * x + r2_3) * x + r2_2) * x + r2_1) * x + r2_0) /
                  ((((x + r2_8) * x + r2_7) * x + r2_6) * x + r2_5);

        if(x < 12)
            return ((((r3_4 * x + r3_3) * x + r3_2) * x + r3_1) * x + r3_0) /
                   ((((x + r3_8) * x + r3_7) * x + r3_6) * x + r3_5);

        if(x > 3e6)
            return k;

        /* otherwise*/
            return k + x1 *
                  ((r4_2 * x2 + r4_1) * x2 + r4_0) /
                  ((x2 + r4_4) * x2 + r4_3);
    }
    exports.logGamma = _logGamma;


    function _logGammaL(x) {

        if (x <= 0) return Infinity;

        if (x <= 1e-3) return _logGamma(x);

        var x65 = x + 6.5,
            a0  = 0.9999999999995183,
            a   = [ 0.1659470187408462e-06
                  , 0.9934937113930748e-05
                  , -0.1385710331296526
                  , 12.50734324009056
                  , -176.6150291498386
                  , 771.3234287757674
                  , -1259.139216722289
                  , 676.5203681218835
                  ];

        var folded = _ss.foldL(new T.Tuple(0,x+7), a, function (t,k) {
            var l = t.fst, t = t.snd;
            return new T.Tuple(l + k / t, t-1);
        });

        return Math.log(folded.fst + a0) + Math.log(constant.sqrt_2_pi) - x65 + (x-0.5) * Math.log(x65);
    }
    exports.logGammaL = _logGammaL;


    /**
     * LOWER INCOMPLETE GAMMA, with helper functions
     **/
    var ig_limit = -88, ig_tolerance = 1e-14, ig_overflow = 1e37;

    function _pearson(x,a,c,g) {
        var a0 = a, c0 = c, g0 = g;

        while(true) {
            var a1 = a0 + 1, c1 = c0 * x / a1, g1 = g0 + c1;

            if(c1 <= ig_tolerance) return g1;

            a0 = a1, c0 = c1, g0 = g1;
        }
    }


    function _contFrac(a,b,c,p1,p2,p3,p4,g) {

        var a1 = a + 1,
            b1 = b + 2,
            c1 = c + 1,
            an = a1 * c1,
            p5 = b1 * p3 - an * p1,
            p6 = b1 * p4 - an * p2,
            rn = p5 / p6,
            f = function (n) {
                if(Math.abs(p5) > ig_overflow) return n / ig_overflow;
                else return n;
            };

        if(Math.abs(g - rn) <= Math.min(ig_tolerance, ig_tolerance * rn)) return g;
        else return _contFrac(a1,b1,c1,f(p3),f(p4),f(p5),f(p6),rn);
    }


    function _g1Approx (x,p) {

        var p1     = p - 1,
            lnP1   = Math.log(p1),
            sqrtP1 = Math.sqrt(p1),

            // Set upper limit for integration
            xu = x > p1 ? Math.max(p1 + 11.5*sqrtP1, x + 6*sqrtP1) :
                          Math.max(0, Math.min(p1 -  7.5*sqrtP1,x - 5*sqrtP1)),

            go = function (y,w) {
                var t = x + (xu - x)*y;
                return w * Math.exp( -(t-p1) + p1*(Math.log(t) - lnP1) );
            },

            s = _ss.sum( _ss.zipWith(constant.coefY,constant.coefW,go) ),
            ans = s * (xu - x) * Math.exp( p1 * (lnP1 - 1) - _logGamma(p) );

        if(ans > 0) return 1 - ans;

        return -ans;
    }


    // note: @x is the upper bound on the integral
    function _incompleteGamma (p,x) {

        if(isNaN(p) || isNaN(x)) return NaN;

        if(x < 0 || p <= 0) return Infinity;

        if(x === 0) return 0;

        var norm = function (a) { return 0.5 * error.erfc(- a / constant.sqrt_2); };

        if(p >= 2e5) return norm(3 * Math.sqrt(p) * ( Math.pow(x/p,1/3) + 1/(9*p) - 1) );

        if(p >= 500) return _g1Approx(x,p);

        if(x >= 1e8) return 1;

        if(x <= 1 || x < p) {
            var a = p * Math.log(x) - x - _logGamma(p + 1),
                g0 = a + Math.log( _pearson(x,p,1,1) );
            return g0 > ig_limit ? Math.exp(g0) : 0;
        }

        var cf_a = 1 - p,
            cf_b = cf_a + x + 1,
            p3 = x + 1,
            p4 = x * cf_b,
            cf = _contFrac(cf_a, cf_b, 0, 1, x, p3, p4, (p3/p4));

        var g1 = p * Math.log(x) - x - _logGamma(p) + Math.log(cf);
        return g1 > ig_limit ? 1 - Math.exp(g1) : 1;
    }
    exports.incompleteGamma = _incompleteGamma;

}).call(this);
