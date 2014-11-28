(function () {

    'use strict';

    var _ss       = require('../utility/collection.js'),
        _         = require('underscore'),
        error     = require('./error.js'),
        constant  = require('./constants.js'),
        gamma     = require('./gamma.js'),
        logarithm = require('./logarithm.js');


    function _logBeta (a,b) {

        var p   = Math.min(a, b),
            q   = Math.max(a, b),
            ppq = p / pq,
            pq  = p + q,
            c   = gamma.logGammaCorrection(q) - logGammaCorrection(pq);

        if(p < 0) return NaN;

        if(p == 0) return Infinity;

        if(p >= 10) return Math.log(q) * (-0.5) + constant.ln_sqrt_2_pi +
                           gamma.logGammaCorrection(p) + c + (p - 0.5) *
                           Math.log(ppq) + q * logarithm.log1p(-ppq);

        if(q >= 10) return gamma.logGamma(p) + c + p - p * Math.log(pq) +
                           (q - 0.5) * logarithm.log1p(-ppq);

        return gamma.logGamma(p) + gamma.logGamma(q) - gamma.logGamma(pq);
    }


    function _incompleteBeta (p,q,x) {
        return _incompleteBeta_0(_logBeta(p,q),p,q,x);
    }


    function _incompleteBeta_0 (beta,p,q,x) {
        if(p <= 0 || q <= 0) throw new Error("incompleteBeta_: p <= 0 || q <= 0");

        if(x <  0 || x >  1 || isNaN(x)) throw new Error("incompletBeta_: x out of [0,1] range");

        if(x == 0 || x == 1) return x;

        if(p >= (p+q) * x) return _incompleteBetaWorker(beta, p, q, x);

        return 1 - _incompleteBetaWorker(beta, q, p, (1-x));
    }


    function _incompleteBetaApprox (beta, p, q, x) {
        var p1    = p - 1,
            q1    = q - 1,
            mu    = p / (p + q),
            lnmu  = Math.log(mu),
            lnmuc = Math.log(1 - mu),

            t = Math.sqrt(p*q / ( (p+q) * (p+q) * (p + q + 1) )),

            // Upper limit for integration
            xu = Math.max(0, Math.min(mu - 10*t, x - 5*t)),

            // Calculate incomplete beta by quadrature
            go = function (y,w) {
                var go_t = x + (xu - x) * y;
                return w * Math.exp( p1 * (Math.log(go_t) - lnmu) + q1 * (Math.log(1-t) - lnmuc) );
            },

            s   = _ss.sum(_ss.zipWith( constant.coefY, constant.coefW, go)),
            ans = s * (xu - x) * Math.exp( p1 * lnmu + q1 * lnmuc - beta );

        if(ans > 0) return 1 - ans;

        return -ans;
    }


    function _incompleteBetaWorker (beta, p, q, x) {

        if(p > 3000 && q > 3000) return _incompleteBetaApprox(beta, p, q, x);

        var eps = 1e-15, cx  = 1 - x;

        var psq = (p+q), ns = Math.trunc(q + cx * (p+q)), ai = 1, term = 1, betain = 1;

        while(true) {
            var fact;
            if     (ns > 0)  fact = (q - ai) * x/cx;
            else if(ns == 0) fact = (q - ai) * x;
            else             fact = psq * x;

            var term1 = term * fact / (p + ai),
                betain1 = betain + term1,
                psq1 = ns < 0 ? psq + 1 : psq,
                db = Math.abs(term1);

            if(db <= eps && db <= eps*betain1)
                return betain1 * Math.exp( p * Math.log(x) + (q - 1) * Math.log(cx) - beta) / p;

            psq = psq1;
            ns = ns - 1;
            ai = ai + 1;
            term = term1;
            betain = betain1;
        }
    }


    function _invIncompleteBeta () {

    }


    function _invIncompleteBetaWorker () {

    }

}).call(this);
