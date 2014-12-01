'use strict';

var T   = require('./tuple.js'),
    N   = require('./number.js'),
    _   = require('underscore'),
    _ss = require('./collection.js');


function _Matrix (rows,columns,exponent,data) {

    this.rows       = rows;
    this.columns    = columns;
    this.exponent   = exponent;
    this.data       = data;


    /**
     * get the value at location
     **/
    this.get = function (row,column) {
        return this.data[row * this.columns + column];
    };


    /**
     * adjust the value at location with a function,
     * or set it with a value.
     **/
    this.set = function (row,column,setter) {
        if(_.isFunction(setter)) {
            this.data[row * this.columns + column] =
                setter(this.data[row * this.columns + column]);
        }

        else {
            this.data[row * this.columns + column] = setter;
        }
    };

    this.log = function () {
        var mat = [];
        for (var i = 0; i < this.rows; i++) {
            var row = [];
            for (var j = 0; j < this.columns; j++) {
                row.push(this.get(i,j));
            };
            mat.push(row);
        };
        console.log(mat);
    };


    // note: shallow copy of array object
    this.clone = function () {
        return new _Matrix(this.rows, this.columns, this.exponent, this.data.slice(0));
    }
}
exports.Matrix = _Matrix;


/**
 * get a tuple of (number of rows, number of columns)
 **/
function _dimension () {
    return { rows: this.rows, columns: this.columns };
}
_Matrix.prototype.dimension = _dimension;


/**
 * get the column of the matrix at index i
 **/
function _column (i) {
    return _ss.backpermute( this.data, _ss.enumFromStepN(i, this.columns, this.rows) );
}
_Matrix.prototype.column = _column;


/**
 * get the row of the matrix at index i
 **/
function _row (i) {
    return _ss.slice1(this.data, this.columns*i, this.columns);
}
_Matrix.prototype.row = _row;


/**
 * matrix transpose that mutates the underlying matrix object
 * TODO: consider also adding an version that creates a new
 *       transposed matrix
 **/
function _transpose() {
    var newCols = this.rows,
        newRows = this.columns,
        self    = this,
        newData = _ss.generate(newCols*newRows, function (i) {
            var qr = N.quoteRem(i,self.rows);
            return self.get(qr.snd, qr.fst);
        });

    this.columns = newCols;
    this.rows = newRows;
    this.data = newData;

    return this;
}
_Matrix.prototype.transpose = _transpose;


/**
 * Calculate the Euclidean norm of a vector
 **/
function _norm(vector) {
    return Math.sqrt(_ss.sum(_.map(vector, function (x) {
        return x*x;
    })));
}
exports.norm = _norm;


/**
 * create a matrix where all entries are k
 **/
function _replicate(rows, columns, k) {
    return new _Matrix(rows, columns, 0, _ss.replicate(rows*columns, k));
}
exports.replicate = _replicate;


function _innerProduct(j, k) {
    return _ss.sum(_ss.zipWith(this.column(j), this.column(k), function (a,b) {
        return a * b;
    }));
}
_Matrix.prototype.innerProduct = _innerProduct;


/**
 * multiply a matrix by a vector
 **/
function _multiplyVector (matrix,vector) {

    if(matrix.columns != vector.length)
        throw new Error('statscript.matrix.multiplyVector: dim mismatch');

    return _ss.generate(matrix.rows, function (rw) {
        var r = matrix.row(rw);
        return _ss.sum(_ss.zipWith(vector, r, function (a,b) {
            return a * b;
        }));
    });
}
exports.multiplyVector = _multiplyVector;


/**
 * multiply a matrix by a matrix
 **/
function _multiplyMatrix (m1,m2) {
    var r1 = m1.rows, e1 = m1.exponent
        c2 = m2.columns, e2 = m2.exponent;

    var data = _ss.generate(r1*c2, function (t) {
        var qrem = N.quoteRem(t,c2),
            i    = qrem.fst,
            j    = qrem.snd;

        return _ss.sum(_ss.zipWith( m1.row(i), m2.column(j), function (a,b) {
            return a * b;
        }));
    });

    return new _Matrix(r1,c2,e1+e2,data);
}
exports.multiplyMatrix = _multiplyMatrix;


/**
 * QR decomposition, returns a tuple of Matrices
 **/
function _qrDecomposition (matrix) {
    var mat = matrix.clone(),
        m   = mat.rows,
        n   = mat.columns,
        r   = _replicate(n,n,0);

    _ss.for(0,n,function (j) {
        var cn = _norm(mat.column(j));
        r.set(j,j,cn);

        _ss.for(0,m, function (i) {
            mat.set(i,j, function (el) {
                return el / cn;
            });
        });

        _ss.for(j+1, n, function (jj) {
            var p = mat.innerProduct(j,jj);
            r.set(j,jj,p);

            _ss.for(0, m, function (i0) {
                var aij = mat.get(i0,j);
                mat.set(i0,jj,function (el0) {
                    return el0 - (p*aij);
                });
            });

        });

    });

    return new T.Tuple(mat,r);
}
exports.qrDecomposition = _qrDecomposition;
