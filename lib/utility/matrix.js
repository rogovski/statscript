'use strict';

var T   = require('./tuple.js'),
    N   = require('./number.js'),
    _ss = require('./collection.js');


function _Matrix (rows,columns,exponent,data) {

    this.rows       = rows;
    this.columns    = columns;
    this.exponent   = exponent;
    this.data       = data;

    this.get = function (row,column) {
        return this.data[row * this.columns + column];
    };

    this.set = function (row,column,setter) {

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
    }
}
exports.Matrix = _Matrix;


function _dimension () {
    return { rows: this.rows, columns: this.columns };
}
_Matrix.prototype.dimension = _dimension;


function _column (i) {
    return _ss.backpermute( this.data, _ss.enumFromStepN(i, this.columns, this.rows) );
}
_Matrix.prototype.column = _column;


function _row (i) {
    return _ss.slice1(this.data, this.columns*i, this.columns);
}
_Matrix.prototype.row = _row;


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
