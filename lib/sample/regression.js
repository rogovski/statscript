'use strict';

var T   = require('../utility/tuple.js'),
    N   = require('../utility/number.js'),
    M   = require('../utility/matrix.js'),
    _   = require('underscore'),
    _ss = require('../utility/collection.js'),
    c   = require('./collection.js');


/**
 * Solve the equation @matrix x = @vector. where
 * @matrix is an upper-triangular square matrix
 * @vector is of the same length as rows\columns in @matrix
 **/
function _solve(matrix, vector) {
    if(matrix.rows != vector.length)
        throw new Error("row/vector mismatch");

    var s = vector.slice(0);

    _ss.rfor(matrix.rows, 0, function (i) {
        var si = s[i] / matrix.get(i,i);
        s[i] = si;

        _ss.for(0,i,function (j) {
            s[j] = s[j] - (matrix.get(j,i) * si);
        });
    });

    return s;
}


/**
 * Compute R^2, the coefficient of determination that
 * indicates goodness-of-fit of a regression.
 **/
function _rSquare(predictors, responders, coeff) {
    var p = function (i) {
            return _ss.sum(_ss.imap(coeff, function (j,x) {
                return x * predictors.get(i,j);
            }));
        },
        r = _ss.sum(_ss.imap(responders, function (i,x) {
            return Math.pow(x - p(i),2);
        })),
        t = _ss.sum(_.map(responders, function (x) {
            return Math.pow(x - c.mean(responders),2);
        }));

    return 1 - r / t;
}
exports.rSquare = _rSquare;


/**
 * Compute the ordinary least-squares solution to @matrix x = @vector
 **/
function _ols(matrix,vector) {
    var rs    = matrix.rows,
        cs    = matrix.columns,
        qrres = M.qrDecomposition(matrix),
        q     = qrres.fst,
        r     = qrres.snd;

    if(rs < cs) throw new Error("fewer rows than columns");

    q.transpose();

    return _solve(r,M.multiplyVector(q,vector));
}
exports.ols = _ols;


/**
 * @predictors: Non-empty list of predictor vectors.  Must all have
 * the same length.  These will become the columns of
 * the matrix @matrix solved by 'ols'.
 *
 * @responders: Responder vector.  Must have the same length as the
 * predictor vectors.
 *
 * returns coefficients and r^2
 **/
function _olsRegress(predictors, responders) {
    var lss     = _.map(predictors, function (pls) { return pls.length; }),
        n       = _.first(lss),
        ls      = _.rest(lss);

    // TODO: check if predictors is a list of lists,
    //       and is non-empty

    if(_.some(ls, function (l) {return l != n;}))
        throw new Error("predictor vector length mismatch");

    if(responders.length != n)
        throw new Error("responder predictor length mismatch");

    var mxdata  = _ss.flatten(predictors.concat([_ss.replicate(n,1)])),
        mxpreds = new M.Matrix(lss.length + 1, n, 0, mxdata);

    mxpreds.transpose();

    var coeffs = _ols(mxpreds,responders);
    return new T.Tuple(coeffs, _rSquare(mxpreds,responders,coeffs));

}
exports.olsRegress = _olsRegress;

// var r = statscript.sample.regression; r.olsRegress([[1,2,3,4,5]], [2,4,6,8,10]);