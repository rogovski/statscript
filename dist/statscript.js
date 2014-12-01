/**
 * statscript.js
 *
 * @version 0.0.0
 * @date    2014-12-01
 *
 * @license
 * Copyright (C) 2014 Michael Rogowski <michaeljrogowski@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["statscript"] = factory();
	else
		root["statscript"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * statscript.js factory function.
	 */
	function create (config) {
	  // simple test for ES5 support
	  if (typeof Object.create !== 'function') {
	    throw new Error('ES5 not supported by this JavaScript engine. ' +
	        'Please load the es5-shim and es5-sham library for compatibility.');
	  }

	  // create namespace
	  var ss = {};

	  ss.create = create;

	  ss.collection = __webpack_require__(2);
	  ss.tuple = __webpack_require__(3);
	  ss.number = __webpack_require__(4);
	  ss.matrix = __webpack_require__(5);

	  ss.random = {};
	  ss.random.uniform = __webpack_require__(6);
	  ss.random.normal = __webpack_require__(7);

	  ss.numeric = {};
	  ss.numeric.constants = __webpack_require__(8);
	  ss.numeric.error = __webpack_require__(9);
	  ss.numeric.kbn = __webpack_require__(10);
	  ss.numeric.root = __webpack_require__(11);
	  ss.numeric.chebyshev = __webpack_require__(12);
	  ss.numeric.gamma = __webpack_require__(13);
	  ss.numeric.logarithm = __webpack_require__(14);
	  ss.numeric.polynomial = __webpack_require__(15);
	  ss.numeric.beta = __webpack_require__(16);
	  ss.numeric.combinations = __webpack_require__(17);
	  ss.numeric.factorial = __webpack_require__(18);

	  ss.distribution = {};
	  ss.distribution.normal = __webpack_require__(19);
	  ss.distribution.poisson = __webpack_require__(20);

	  ss.sample = {};
	  ss.sample.collection = __webpack_require__(21);
	  ss.sample.histogram = __webpack_require__(22);
	  ss.sample.regression = __webpack_require__(23);

	  // return the new instance
	  return ss;
	}

	// create a default instance of math.js
	var ss = create();

	// export the default instance
	module.exports = ss;

	// nodemon --exec "rebuild.bat" .\rebuild.bat


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';

	var _ = __webpack_require__(24),
	    T = __webpack_require__(3);

	//(a -> a -> a) -> [a] -> a
	function _foldR1 (ls, fn) {
	    if(ls.length == 0) throw new Error('foldr1: empty list');

	    var acc = ls[0];
	    for (var i = 1; i < ls.length; i++) {
	        acc = fn( ls[i], acc );
	    };
	    return acc;
	}
	exports.foldR1 = _foldR1;

	//(a -> b -> b) -> b -> [a] -> b
	function _foldR (seed, ls, fn) {
	    var acc = seed;
	    for (var i = 0; i < ls.length; i++) {
	        acc = fn( ls[i], acc );
	    };
	    return acc;
	}
	exports.foldR = _foldR;


	function _foldL (seed, ls, fn) {
	    var acc = seed;
	    for (var i = 0; i < ls.length; i++) {
	        acc = fn( acc, ls[i] );
	    };
	    return acc;
	}
	exports.foldL = _foldL;


	function _unfoldr (seed, generate) {
	    var s = seed, accum = [], safety = 35000;

	    while(safety > 0) {
	        var res = generate(s);
	        if(_.isEmpty(res)) { break; }
	        else {
	          accum.push(res.fst);
	          s = res.snd;
	        }
	        safety--;
	    }
	    return accum;
	}
	exports.unfoldr = _unfoldr;


	function _unfoldrN (n, seed, generate) {
	    var s = seed, accum = [], safety = 35000, idx = 0;

	    while(idx < n && safety > 0) {
	        var res = generate(s);
	        if(_.isEmpty(res)) { break; }
	        else {
	          accum.push(res.fst);
	          s = res.snd;
	        }
	        safety--;
	        idx++;
	    }
	    return accum;
	}
	exports.unfoldrN = _unfoldrN;


	function _zipWith (xs, ys, fn) {
	    var longerList = xs.length > ys.length ? ys : xs,
	        accum = [];
	    for (var i = 0; i < longerList.length; i++) {
	        accum.push( fn( xs[i],ys[i] ) );
	    };
	    return accum;
	}
	exports.zipWith = _zipWith;


	function _replicate(n, a) {
	    var accum = [];
	    for (var i = 0; i < n; i++) {
	        accum.push(a);
	    };
	    return accum;
	}
	exports.replicate = _replicate;


	function _generate(n, fn) {
	    var accum = [];
	    for (var i = 0; i < n; i++) {
	        accum.push(fn(i));
	    };
	    return accum;
	}
	exports.generate = _generate;


	function _sum (ls) {
	    var accum = 0;
	    for (var i = 0; i < ls.length; i++) {
	        accum += ls[i];
	    };
	    return accum;
	}
	exports.sum = _sum;


	//backpermute <a,b,c,d> <0,3,2,3,1,0> = <a,d,c,d,b,a>
	function _backpermute (ls, lsIdx) {
	    var accum = [];
	    for (var i = 0; i < lsIdx.length; i++) {
	        accum.push(ls[lsIdx[i]]);
	    };
	    return accum;
	}
	exports.backpermute = _backpermute;


	// enumFromStepN 1 0.1 5 = <1,1.1,1.2,1.3,1.4>
	function _enumFromStepN (from,step,n) {
	    var next = from, cnt = 0, accum = [];
	    while(cnt < n) {
	        accum.push(next);
	        next += step;
	        cnt++;
	    }
	    return accum;
	}
	exports.enumFromStepN = _enumFromStepN;


	/**
	 * flatten an array of arrays
	 **/
	function _flatten (lls) {
	    var accum = [];
	    for (var i = 0; i < lls.length; i++) {
	        for (var j = 0; j < lls[i].length; j++) {
	            accum.push((lls[i])[j]);
	        };
	    };
	    return accum;
	}
	exports.flatten = _flatten;


	/**
	 * a variation ECMAscript slice that uses length
	 * instead of index to generate the subarray
	 **/
	function _slice1(ls,start,len) {
	    return ls.slice(start, start+len);
	}
	exports.slice1 = _slice1;


	function _for (start,end,fn) {
	    for (var i = start; i < end; i++) fn(i);
	}
	exports.for = _for;


	function _rfor (start,end,fn) {
	    for (var i = start-1; i > end; i--) fn(i);
	}
	exports.rfor = _rfor;


	function _imap (ls,fn) {
	    var accum = [];
	    for (var i = 0; i < ls.length; i++) {
	        accum.push(fn(i,ls[i]));
	    };
	    return accum;
	}
	exports.imap = _imap;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _Tuple (fst,snd) {
	    this.fst = fst;
	    this.snd = snd;
	}
	exports.Tuple = _Tuple;


	function _Triple (fst,snd,trd) {
	    this.fst = fst;
	    this.snd = snd;
	    this.trd = trd;
	}
	exports.Triple = _Triple;


	function _clone (t) {
	    return new _Tuple(t.fst,t.snd);
	}
	exports.clone = _clone;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var T        = __webpack_require__(3),
	    _        = __webpack_require__(24);


	function _sign (x) {
	    if(x > 0) return 1;

	    if(x < 0) return -1;

	    if(x === 0) return 0;
	}


	function _even (x) {
	    return x % 2 === 0;
	}
	exports.even = _even;


	function _odd (x) {
	    return x % 2 === 1;
	}
	exports.odd = _odd;


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


	function _quoteRem (a,b) {
	    return new T.Tuple(Math.trunc(a / b), a % b);
	}
	exports.quoteRem = _quoteRem;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var T   = __webpack_require__(3),
	    N   = __webpack_require__(4),
	    _   = __webpack_require__(24),
	    _ss = __webpack_require__(2);


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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	

	'use strict';

	function _uniform_Float () {
	    return Math.random(0,1);
	}
	exports.uniform_Float = _uniform_Float;


	function _uniformR_Float (min,max) {
	    return Math.random(min,max);
	}
	exports.uniformR_Float = _uniformR_Float;


	function _uniform_Word32 () {
	    // 2147483647 is the highest integer in 32 bits
	    return Math.floor(Math.random(0,1) * 2147483647);
	}
	exports.uniform_Word32 = _uniform_Word32;





/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	

	'use strict';

	var _ss     = __webpack_require__(2),
	    _       = __webpack_require__(24),
	    uniform = __webpack_require__(6),
	    T       = __webpack_require__(3);


	var rNorm = 3.442619855899,
	    blocks_v = 0.00991256303526217,
	    blocks_f = Math.exp(-0.5 * rNorm * rNorm);


	var _blocks_ls = (function () {
	    var seed = new T.Tuple( rNorm, blocks_f ),
	        unfoldResult = _ss.unfoldrN( 126, seed, function (s) {
	            var b = s.fst,
	                g = s.snd,
	                h = Math.sqrt( -2 * Math.log( (blocks_v / b) + g ) ),
	                u = new T.Tuple(h, Math.exp( -0.5 * h * h ) );

	            return new T.Tuple( h, u );
	        } );

	    unfoldResult.unshift(rNorm);
	    unfoldResult.unshift(blocks_v/blocks_f);
	    unfoldResult.push(0);

	    return unfoldResult;
	})();
	exports.blocks = _blocks_ls;


	var _ratios_ls = (function () {
	    return _ss.zipWith(_.rest(_blocks_ls), _blocks_ls, function (a,b) {
	        return a / b;
	    });
	})();
	exports.ratios = _ratios_ls;


	function _normalTail (cond) {
	    while(true) {
	        var x = Math.log(uniform.uniform_Float()) / rNorm,
	            y = Math.log(uniform.uniform_Float())

	        if(!(y * -2 < x*x)) return (cond ? x - rNorm : rNorm - x);
	    }
	}


	function _standard () {
	    while(true) {
	        var u = (uniform.uniform_Float() * 2) - 1,
	            i = (uniform.uniform_Word32 & 127),
	            block_i = _blocks_ls[i],
	            block_j = _blocks_ls[i+1];

	        if(Math.abs(u) < _ratios_ls[i]) return u * block_i;

	        if(i == 0) return _normalTail(u < 0);

	        var x = u * block_i,
	            xx = x * x,
	            d = Math.exp(-0.5 * (block_i * block_i - xx)),
	            e = Math.exp(-0.5 * (block_j * block_j - xx)),
	            c = uniform.uniform_Float();

	        if(e+c*(d-e) < 1) return x;
	    }
	}
	exports.standard = _standard;





/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	

	'use strict';


	exports.sqrt_2 = 1.4142135623730950488016887242096980785696718753769480731766;


	exports.sqrt_2_pi = 2.5066282746310005024157652848110452530069867406099383166299;


	exports.tiny = 2.2250738585072014e-308;


	exports.m_eulerMascheroni = 0.5772156649015328606065121;


	exports.ln_sqrt_2_pi = 0.9189385332046727417803297364056176398613974736377834128171;


	// Coefficients for 18-point Gauss-Legendre integration. They are
	// used in implementation of incomplete gamma and beta functions.
	exports.coefW = [ 0.0055657196642445571, 0.012915947284065419, 0.020181515297735382
	                , 0.027298621498568734,  0.034213810770299537, 0.040875750923643261
	                , 0.047235083490265582,  0.053244713977759692, 0.058860144245324798
	                , 0.064039797355015485,  0.068745323835736408, 0.072941885005653087
	                , 0.076598410645870640,  0.079687828912071670, 0.082187266704339706
	                , 0.084078218979661945,  0.085346685739338721, 0.085983275670394821
	                ];


	exports.coefY = [ 0.0021695375159141994, 0.011413521097787704, 0.027972308950302116
	                , 0.051727015600492421,  0.082502225484340941, 0.12007019910960293
	                , 0.16415283300752470,   0.21442376986779355,  0.27051082840644336
	                , 0.33199876341447887,   0.39843234186401943,  0.46931971407375483
	                , 0.54413605556657973,   0.62232745288031077,  0.70331500465597174
	                , 0.78649910768313447,   0.87126389619061517,  0.95698180152629142
	                ];



/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	

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


	function _invErfc(p) {
	    if(p === 2) return -Infinity;
	    if(p === 0) return Infinity;

	    if(p > 0 && p < 2) {
	        var pp = p <= 1 ? p : (2 - p);
	        var t = Math.sqrt(-2 * Math.log( 0.5 * pp ));
	        var x0 = -0.70711 * ((2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t);

	        var loop = function (j,x) {
	            if(j >= 2) return x;
	            else {
	                var err = _erfc(x) - pp,
	                    x1 = x + err / (1.12837916709551257 * Math.exp(-x * x) - x * err);
	                return loop(j+1, x1);
	            }
	        };

	        if(p <= 1) return loop(0,x0);

	        return -loop(0,x0);
	    }

	    throw new Error("invErfc: p must be in [0,2]");
	}
	exports.invErfc = _invErfc;


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





/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	

	'use strict';

	var _ss     = __webpack_require__(2);


	function _Kbn (sum, c) {
	    this.sum = sum;
	    this.c = c;
	}


	function _kbnAddInternal (kbn_orig, x) {
	    var c_orig = kbn_orig.c, sum_orig = kbn_orig.sum;

	    var sum2 = sum_orig + c_orig;
	    var c2 = null;

	    if( Math.abs( sum_orig ) >= Math.abs( x ) )
	        c2 = c_orig + ( ( sum_orig - sum2 ) + x );

	    else
	        c2 = c_orig + ( ( x - sum2 ) + sum_orig );


	    return new _Kbn( sum2, c2 );
	}


	// public api

	function _zero () {
	    return new _Kbn(0,0);
	}
	exports.zero = _zero;


	function _add (kbn, a) {

	    if( !(kbn instanceof _Kbn) ) {
	        throw new Error(
	            "statscript.numeric.kbn.add: " +
	            "kbn parameter is not of type KBN"
	        );
	    }

	    return _kbnAddInternal( kbn, a );
	}
	exports.add = _add;


	function _sum (ls,fn) {
	    return fn( _ss.foldL( _zero(), ls, _add ) );
	}
	exports.sum = _sum;


	function _unpack (obj) {
	    return obj.sum + obj.c;
	}
	exports.unpack = _unpack;




/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	

	'use strict';

	var _ss     = __webpack_require__(2),
	    _       = __webpack_require__(24),
	    error   = __webpack_require__(9);


	function _RootResult(a) {
	    this.notBracketed = false;
	    this.searchFailed = _.isUndefined(a) ? true : false;
	    this.root = _.isUndefined(a) ? void 0 : a;
	}


	function ridders (tolerance,f_main,a,fa,b,fb,i) {
	    var d    = Math.abs(b - a),
	        dm   = (b - a) * 0.5,
	        m   = a + dm,
	        fm  = f_main(m),
	        dn  = Math.sign(fb - fa) * dm * fm / Math.sqrt(fm*fm - fa*fb),
	        n   = m - Math.sign(dn) * Math.min(Math.abs(dn), Math.abs(dm) - 0.5 * tolerance),
	        fn  = f_main(n);

	    if( error.within( a, b ) ) return new _RootResult(a);

	    else if (fm === 0) return new _RootResult(m);

	    else if (fn === 0) return new _RootResult(n);

	    else if (d < tolerance) return new _RootResult(n);

	    else if (i >= 100) return new _RootResult();

	    else if(n === a || n === b) {
	        if(fm*fa < 0) return ridders(tolerance,f_main,a,fa,m,fm,(i+1));

	        else return ridders(tolerance,f_main,m,fm,b,fb,(i+1));
	    }

	    else if(fn*fm < 0) return ridders(tolerance,f_main,n,fn,m,fm,(i+1));

	    else if(fn*fa < 0) return ridders(tolerance,f_main,a,fa,n,fn,(i+1));

	    else return ridders(tolerance,f_main,n,fn,b,fb,(i+1));
	}



	// @tolerance: absolute error tolerance
	// @lowbound: lower bound of search
	// @highbound: upper bound of search
	// @fn: function to find the roots of
	function _root (tolerance, lowbound, highbound, fn) {
	    var flo = fn(lowbound), fhi = fn(highbound);
	    if(flo === 0) return new _RootResult(lowbound);

	    else if (fhi === 0) return new _RootResult(highbound);

	    else if (flo * fhi > 0) {
	        var res = new _RootResult();
	        res.notBracketed = true;
	        return res;
	    }
	    else return ridders(tolerance, fn, lowbound, flo, highbound, fhi, 0);
	}
	exports.root = _root;





/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	

	'use strict';

	var _ss      = __webpack_require__(2),
	    T        = __webpack_require__(3),
	    _        = __webpack_require__(24);


	function _chebyshev(x,coeffs) {
	    var tail = _.rest(coeffs),
	        folded = _ss.foldR(new T.Tuple(0,0), tail, function (k,t) {
	            var b0 = t.fst, b1 = t.snd;
	            return new T.Tuple(k + (x*2) * b0 - b1, b0)
	        });

	    return _.first(coeffs) + x * folded.fst - folded.snd;
	}
	exports.chebyshev = _chebyshev;


	function _chebyshevBroucke (x,coeffs) {
	    var c = coeffs;
	    c[0] = c[0]/2;

	    return _chebyshev(x,c);
	}
	exports.chebyshevBroucke = _chebyshevBroucke;





/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	

	'use strict';

	var _ss       = __webpack_require__(2),
	    _         = __webpack_require__(24),
	    error     = __webpack_require__(9),
	    constant  = __webpack_require__(8),
	    chebyshev = __webpack_require__(12);


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


	function _logGammaCorrection(x) {
	    if(x < 10) return NaN;

	    var big    = 94906265.62425156,
	        t      = 10 / x,
	        coeffs = [
	                   0.1666389480451863247205729650822e0,
	                  -0.1384948176067563840732986059135e-4,
	                   0.9810825646924729426157171547487e-8,
	                  -0.1809129475572494194263306266719e-10,
	                   0.6221098041892605227126015543416e-13,
	                  -0.3399615005417721944303330599666e-15,
	                   0.2683181998482698748957538846666e-17
	                 ];

	    if(x < big) return chebyshev.chebyshevBroucke( (t * t * 2 - 1), coeffs ) / x;

	    return 1 / ( x * 12 );
	}
	exports.logGammaCorrection = _logGammaCorrection;


	/**
	 * LOWER INCOMPLETE GAMMA
	 *
	 * given by:
	 *           x
	 *  γ(p,x) = ∫ ( t ^ ( p - 1 ) ) * ( e ^ ( - t ) ) dt
	 *           0
	 *
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


	function _invIncompleteGamma () {

	}





/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	

	'use strict';

	var chebyshev = __webpack_require__(12);

	/*
	 * Compute the natural logarithm of 1 + x.  This is accurate even
	 * for values of x near zero, where use of log(1+x) would lose
	 * precision.
	 **/
	function _log1p (x) {

	    if(x == 0) return 0;

	    if(x == -1) return -Infinity;

	    if(x < -1) return NaN;

	    var x1 = Math.abs(x),
	        coeffs = [
	                   0.10378693562743769800686267719098e+1,
	                  -0.13364301504908918098766041553133e+0,
	                   0.19408249135520563357926199374750e-1,
	                  -0.30107551127535777690376537776592e-2,
	                   0.48694614797154850090456366509137e-3,
	                  -0.81054881893175356066809943008622e-4,
	                   0.13778847799559524782938251496059e-4,
	                  -0.23802210894358970251369992914935e-5,
	                   0.41640416213865183476391859901989e-6,
	                  -0.73595828378075994984266837031998e-7,
	                   0.13117611876241674949152294345011e-7,
	                  -0.23546709317742425136696092330175e-8,
	                   0.42522773276034997775638052962567e-9,
	                  -0.77190894134840796826108107493300e-10,
	                   0.14075746481359069909215356472191e-10,
	                  -0.25769072058024680627537078627584e-11,
	                   0.47342406666294421849154395005938e-12,
	                  -0.87249012674742641745301263292675e-13,
	                   0.16124614902740551465739833119115e-13,
	                  -0.29875652015665773006710792416815e-14,
	                   0.55480701209082887983041321697279e-15,
	                  -0.10324619158271569595141333961932e-15
	                 ];

	    if(x1 < Number.EPSILON * 0.5) return x;

	    if((x >= 0 && x < 1e-8) || (x >= -1e-9 && x < 0)) return x * (1 - x * 0.5);

	    if(x1 < 0.375) return x * (1 - x * chebyshev.chebyshevBroucke((x / 0.375), coeffs));

	    return Math.log(1+x);
	}
	exports.log1p = _log1p;






/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	

	'use strict';

	var _ss      = __webpack_require__(2),
	    _        = __webpack_require__(24);


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





/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	

	'use strict';

	var _ss       = __webpack_require__(2),
	    _         = __webpack_require__(24),
	    error     = __webpack_require__(9),
	    constant  = __webpack_require__(8),
	    gamma     = __webpack_require__(13),
	    logarithm = __webpack_require__(14);


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




/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	

	'use strict';

	function _choose(n,k) {
	    var max = Math.max(k, n - k);
	    var result = 1;
	    for (var i = 1; i <= n - max; i++) {
	        result = result * (max + i) / i;
	    }
	    return result;
	}
	exports.choose = _choose;





/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	

	'use strict';

	var _ss      = __webpack_require__(2),
	    number   = __webpack_require__(4),
	    _        = __webpack_require__(24),
	    polyn    = __webpack_require__(15),
	    gamma    = __webpack_require__(13),
	    constant = __webpack_require__(8);


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





/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	

	'use strict';

	var _ss      = __webpack_require__(2),
	    _        = __webpack_require__(24),
	    error    = __webpack_require__(9),
	    constant = __webpack_require__(8);


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


	/**
	 * standard normal distribution with mean 0
	 * and standard deviation 1
	 **/
	function _standard () {
	    return new _ND(0,1);
	}
	exports.standard = _standard;


	/**
	 * standard normal distribution with mean
	 * and standard deviation set by caller
	 **/
	function _normal (mean, stdDev) {
	    return new _ND(mean, stdDev);
	}
	exports.normal = _normal;


	/**
	 * cumulative distribution function. gives the
	 * probability that a normally distributed random
	 * variable X will have a value less than or
	 * equal to x. P(X <= x)
	 **/
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
	            return error.erfc((distribution.mean - p) / distribution.cdfDenom) / 2;
	        }
	    }

	    return error.erfc((distribution.mean - probability) / distribution.cdfDenom) / 2;
	}
	exports.cdf = _cdf;


	/**
	 * compliment of the cumulative distribution function.
	 * gives the probability that a normally distributed
	 * random variable X will have a value greater than or
	 * equal to x. P(X >= x)
	 **/
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
	            return error.erfc((p - distribution.mean) / distribution.cdfDenom) / 2;
	        }
	    }

	    return error.erfc((probability - distribution.mean) / distribution.cdfDenom) / 2;
	}
	exports.complCdf = _complCdf;


	function _quantile(dist,p) {
	    if(p === 0) return - Infinity;

	    if(p === 1) return Infinity;

	    if(p === 0.5) return dist.mean;

	    if(p > 0 && p < 1) {
	        var x = - error.invErfc(2 * p);
	        return x * dist.cdfDenom + dist.mean;
	    }

	    throw new Error("statistics.distribution.normal.quantile: p must be in [0,1] range.");
	}
	exports.quantile = _quantile;


	/**
	 * natural log of normal probability density function
	 **/
	function _logDensity(dist,x) {
	    var xm = x - dist.mean, sd = dist.stdDev;
	    return (-xm * xm / (2 * sd * sd)) - dist.pdfDenom;
	}
	exports.logDensity = _logDensity;


	/**
	 * probability density function for a normal distribution
	 **/
	function _density(distribution,x) {
	    if( !(distribution instanceof _ND) ) {
	        throw new Error(
	            "statscript.distribution.normal.density: " +
	            "distribution parameter is not Normal"
	        );
	    };

	    // if @distribution is the only parameter
	    // partially apply the density function to it
	    if(_.isUndefined(x)) {

	        return function (p) {
	            return Math.exp(_logDensity(distribution,p));
	        }
	    }

	    return Math.exp(_logDensity(distribution,x));
	}
	exports.density = _density;


	/**
	 * find the root of the cdf function. for those familiar with
	 * excel, this basically allows the creation of the NORMSINV
	 * function.
	 **/
	function _findRoot(dist,prob,initGuess,lower,upper) {
	    var accuracy = 1e-15, maxIters = 150;
	    var loop = function (i,dx,x,lo,hi) {
	        // base case: return guess
	        if(Math.abs(dx) <= accuracy || i >= maxIters) return x;

	        else {
	            var err = _cdf(dist,x) - prob, pdf = _density(dist,x);

	            var lo1, hi1, dx1, x1, dx2, x2;

	            if(err < 0) { lo1 = x; hi1 = hi; }
	            else { lo1 = lo; hi1 = x; }

	            if(pdf != 0) { dx1 = (err / pdf); x1 = (x-dx); }
	            else { dx1 = dx; x1 = x; }

	            if(x1 < lo1 || x1 > hi1 || pdf === 0) { var y = (lo1 + hi1) / 2; dx2 = y-x; x2 = y; }
	            else { dx2 = dx1; x2 = x1; }

	            return loop( (i+1), dx2, x2, lo1, hi1 );
	        }
	    };

	    return loop(0,1,initGuess,lower,upper);
	}
	exports.findRoot = _findRoot;




/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * there are 12 cars crossing a bridge per unit time t on average
	 *
	 * The probability of having 16 or less cars crossing the bridge in a particular interval t:
	 * cumulative (poisson 12) 16
	 * >> 0.8987089925601622
	 *
	 * The probability of having 17 or more cars crossing the bridge in a particular interval t:
	 * complCumulative (poisson 12) 16
	 * >> 0.10129100743983777
	 *
	 **/

	'use strict';

	var _ss       = __webpack_require__(2),
	    number    = __webpack_require__(4),
	    _         = __webpack_require__(24),
	    polyn     = __webpack_require__(15),
	    gamma     = __webpack_require__(13),
	    constant  = __webpack_require__(8),
	    factorial = __webpack_require__(18);

	function _PD(lambda) {
	    this.lambda = lambda;
	}


	function _poisson (lambda) {
	    return new _PD(lambda);
	}
	exports.poisson = _poisson;


	function _cdf(distribution,x) {
	    if( !(distribution instanceof _PD) ) {
	        throw new Error(
	            "statscript.distribution.poisson.cdf: " +
	            "distribution parameter is not Poisson"
	        );
	    };

	    // if @distribution is the only parameter
	    // partially apply the cdf function to it
	    if(_.isUndefined(x)) {
	        return function (x) {
	            if(x < 0) return 0;
	            if(!isFinite(x)) return 1;
	            if(isNaN(x)) throw new Error("statscript.distribution.poisson.cumulative: NaN input");
	            return 1 - gamma.incompleteGamma((Math.floor(x) + 1), distribution.lambda);
	        };
	    }

	    if(x < 0) return 0;
	    if(!isFinite(x)) return 1;
	    if(isNaN(x)) throw new Error("statscript.distribution.poisson.cumulative: NaN input");
	    return 1 - gamma.incompleteGamma((Math.floor(x) + 1), distribution.lambda);
	}
	exports.cdf = _cdf;


	function _complCdf(distribution,x) {
	    if( !(distribution instanceof _PD) ) {
	        throw new Error(
	            "statscript.distribution.poisson.complCdf: " +
	            "distribution parameter is not Poisson"
	        );
	    };

	    // if @distribution is the only parameter
	    // partially apply the cdf function to it
	    if(_.isUndefined(x)) {
	        return function (x) {
	            return 1 - _cdf(distribution, x);
	        };
	    }

	    return 1 - _cdf(distribution,x);
	}
	exports.complCdf = _complCdf;




/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';

	var T        = __webpack_require__(3),
	    _ss      = __webpack_require__(2),
	    _        = __webpack_require__(24),
	    kbn      = __webpack_require__(10);


	function _kbn_sum (ls) {
	    return kbn.sum( ls, kbn.unpack );
	}


	function _robustSumVar(m, ls) {
	    return _kbn_sum( _.map( ls, function (n) {
	        return Math.pow( n - m, 2 );
	    } ) );
	}


	function _range(sample) {
	    return _.max(sample) - _.min(sample);
	}
	exports.range = _range;


	function _mean(sample) {
	    return _kbn_sum(sample) / sample.length;
	}
	exports.mean = _mean;


	function _centralMoment(a,sample) {

	    if(a < 0) throw new Error("statscript.sample.centralMoment: negative input");
	    else if(a == 0) return 1;
	    else if(a == 1) return 0;
	    else {
	        var m = _mean(sample);
	        var go = function (x) {
	            return Math.pow(x - m,a);
	        };

	        return _kbn_sum( _.map( sample, go ) ) / sample.length;
	    }
	}
	exports.centralMoment = _centralMoment;


	function _centralMoments(a,b,sample) {
	    var tuple = mk_tuple;

	    if(a < 2 || b < 2) {
	        return new T.Tuple( _centralMoment( a, sample ), _centralMoment( b, sample ) );
	    }
	    else {
	        var m = _mean( sample );
	        var n = sample.length;

	        var finish = function (tup) { return new T.Tuple( tup.fst / n, tup.snd / n ); };
	        var go = function (tup, x) {
	            var d = x - m;
	            var one = tup.fst + Math.pow(d,a);
	            var two = tup.snd + Math.pow(d,b);
	            return new T.Tuple(one,two);
	        };
	        return finish( _ss.foldL( new T.Tuple(0,0), sample, go ) );
	    }
	}
	exports.centralMoments = _centralMoments;


	function _skewness(sample) {
	    var cm = _centralMoments( 3, 2, sample );
	    return cm.fst * Math.pow( cm.snd, - 1.5 );
	}
	exports.skewness = _skewness;


	function _kurtosis(sample) {
	    var cm = _centralMoments( 4, 2, sample );
	    return ( cm.fst / ( cm.snd * cm.snd ) ) - 3;
	}
	exports.kurtosis = _kurtosis;


	function _variance(sample) {
	    var n = sample.length;

	    if(n > 1) return _robustSumVar(_mean(sample), sample) / n;
	    else return 0;
	}
	exports.variance = _variance;


	function _varianceUnbiased(sample) {
	    var n = sample.length;

	    if(n > 1) return _robustSumVar(_mean(sample), sample) / ( n - 1 );
	    else return 0;
	}
	exports.varianceUnbiased = _varianceUnbiased;


	function _stdDev(sample) {
	    return Math.sqrt(_varianceUnbiased( sample ));
	}
	exports.stdDev = _stdDev;





/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';

	var T        = __webpack_require__(3),
	    _ss      = __webpack_require__(2),
	    _        = __webpack_require__(24),
	    constant = __webpack_require__(8);


	function _histogramHelper (numberOfBins,lo,hi,sample) {
	    return histogramBinHelper(numberOfBins, lo, hi, sample,
	        _ss.replicate(numberOfBins, 0));
	}


	function _histogramBinHelper(numberOfBins,lo,hi,xs,bins) {
	    var len = xs.length,
	        d = ( (hi - lo) * (1 + Number.EPSILON) ) / numberOfBins;

	    var go = function (i) {
	        if(i >= len) return bins;
	        else {
	            var x = xs[i], b = Math.trunc( (x - lo) / d );
	            bins[b] = bins[b] + 1;
	            return go(i+1);
	        }
	    };

	    return go(0);
	}


	function _histogram(numberOfBins, sample) {
	    var lohi = _range(numberOfBins, sample);
	    var lo = lohi.lo, hi = lohi.hi;
	    var d = (hi - lo) / numberOfBins;
	    var step = function (i) { return lo + d * i; }

	    return {
	        bins: _ss.generate(numberOfBins,step),
	        frequency: _histogramHelper(numberOfBins, lo, hi, sample)
	    };
	}
	exports.histogram = _histogram;


	function _range(numberOfBins, sample) {
	    if(numberOfBins < 1) throw new Error("statscript.sample.histogram.range: invalid bin count");

	    if(sample.length == 0) throw new Error("statscript.sample.histogram.range: empty sample");

	    var lo = _.min(sample), hi = _.max(sample);

	    if(lo === hi) {
	        var a = Math.abs( lo ) / 10;
	        if(a < constant.tiny) return { lo: -1, hi: 1 };
	        else return { lo: lo - a, hi: lo + a };
	    }
	    else {
	        var d = numberOfBins === 1 ? 0 : ( (hi - lo) / ( (numberOfBins - 1) * 2 ) );
	        return { lo: lo - d, hi: hi + d };
	    }
	}
	exports.range = _range;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var T   = __webpack_require__(3),
	    N   = __webpack_require__(4),
	    M   = __webpack_require__(5),
	    _   = __webpack_require__(24),
	    _ss = __webpack_require__(2),
	    c   = __webpack_require__(21);


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
	            console.log('for');
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
	    console.log('wtf');
	    return new T.Tuple(coeffs, _rSquare(mxpreds,responders,coeffs));

	}
	exports.olsRegress = _olsRegress;

	// var r = statscript.sample.regression; r.olsRegress([[1,2,3,4,5]], [2,4,6,8,10]);

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.7.0
	//     http://underscorejs.org
	//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.

	(function() {

	  // Baseline setup
	  // --------------

	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;

	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;

	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    concat           = ArrayProto.concat,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind;

	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };

	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }

	  // Current version.
	  _.VERSION = '1.7.0';

	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var createCallback = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };

	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  _.iteratee = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return createCallback(value, context, argCount);
	    if (_.isObject(value)) return _.matches(value);
	    return _.property(value);
	  };

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    if (obj == null) return obj;
	    iteratee = createCallback(iteratee, context);
	    var i, length = obj.length;
	    if (length === +length) {
	      for (i = 0; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };

	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    if (obj == null) return [];
	    iteratee = _.iteratee(iteratee, context);
	    var keys = obj.length !== +obj.length && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length),
	        currentKey;
	    for (var index = 0; index < length; index++) {
	      currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };

	  var reduceError = 'Reduce of empty array with no initial value';

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = function(obj, iteratee, memo, context) {
	    if (obj == null) obj = [];
	    iteratee = createCallback(iteratee, context, 4);
	    var keys = obj.length !== +obj.length && _.keys(obj),
	        length = (keys || obj).length,
	        index = 0, currentKey;
	    if (arguments.length < 3) {
	      if (!length) throw new TypeError(reduceError);
	      memo = obj[keys ? keys[index++] : index++];
	    }
	    for (; index < length; index++) {
	      currentKey = keys ? keys[index] : index;
	      memo = iteratee(memo, obj[currentKey], currentKey, obj);
	    }
	    return memo;
	  };

	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = function(obj, iteratee, memo, context) {
	    if (obj == null) obj = [];
	    iteratee = createCallback(iteratee, context, 4);
	    var keys = obj.length !== + obj.length && _.keys(obj),
	        index = (keys || obj).length,
	        currentKey;
	    if (arguments.length < 3) {
	      if (!index) throw new TypeError(reduceError);
	      memo = obj[keys ? keys[--index] : --index];
	    }
	    while (index--) {
	      currentKey = keys ? keys[index] : index;
	      memo = iteratee(memo, obj[currentKey], currentKey, obj);
	    }
	    return memo;
	  };

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var result;
	    predicate = _.iteratee(predicate, context);
	    _.some(obj, function(value, index, list) {
	      if (predicate(value, index, list)) {
	        result = value;
	        return true;
	      }
	    });
	    return result;
	  };

	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    if (obj == null) return results;
	    predicate = _.iteratee(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };

	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(_.iteratee(predicate)), context);
	  };

	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    if (obj == null) return true;
	    predicate = _.iteratee(predicate, context);
	    var keys = obj.length !== +obj.length && _.keys(obj),
	        length = (keys || obj).length,
	        index, currentKey;
	    for (index = 0; index < length; index++) {
	      currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    if (obj == null) return false;
	    predicate = _.iteratee(predicate, context);
	    var keys = obj.length !== +obj.length && _.keys(obj),
	        length = (keys || obj).length,
	        index, currentKey;
	    for (index = 0; index < length; index++) {
	      currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };

	  // Determine if the array or object contains a given value (using `===`).
	  // Aliased as `include`.
	  _.contains = _.include = function(obj, target) {
	    if (obj == null) return false;
	    if (obj.length !== +obj.length) obj = _.values(obj);
	    return _.indexOf(obj, target) >= 0;
	  };

	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      return (isFunc ? method : value[method]).apply(value, args);
	    });
	  };

	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };

	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matches(attrs));
	  };

	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matches(attrs));
	  };

	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = obj.length === +obj.length ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = _.iteratee(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = obj.length === +obj.length ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = _.iteratee(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = obj && obj.length === +obj.length ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };

	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (obj.length !== +obj.length) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };

	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = _.iteratee(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };

	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = _.iteratee(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };

	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });

	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });

	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });

	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = _.iteratee(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = array.length;
	    while (low < high) {
	      var mid = low + high >>> 1;
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };

	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (obj.length === +obj.length) return _.map(obj, _.identity);
	    return _.values(obj);
	  };

	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
	  };

	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = _.iteratee(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };

	  // Array Functions
	  // ---------------

	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    if (n < 0) return [];
	    return slice.call(array, 0, n);
	  };

	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N. The **guard** check allows it to work with
	  // `_.map`.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array. The **guard** check allows it to work with `_.map`.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return slice.call(array, Math.max(array.length - n, 0));
	  };

	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array. The **guard**
	  // check allows it to work with `_.map`.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };

	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };

	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, output) {
	    if (shallow && _.every(input, _.isArray)) {
	      return concat.apply(output, input);
	    }
	    for (var i = 0, length = input.length; i < length; i++) {
	      var value = input[i];
	      if (!_.isArray(value) && !_.isArguments(value)) {
	        if (!strict) output.push(value);
	      } else if (shallow) {
	        push.apply(output, value);
	      } else {
	        flatten(value, shallow, strict, output);
	      }
	    }
	    return output;
	  };

	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false, []);
	  };

	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (array == null) return [];
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = _.iteratee(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = array.length; i < length; i++) {
	      var value = array[i];
	      if (isSorted) {
	        if (!i || seen !== value) result.push(value);
	        seen = value;
	      } else if (iteratee) {
	        var computed = iteratee(value, i, array);
	        if (_.indexOf(seen, computed) < 0) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (_.indexOf(result, value) < 0) {
	        result.push(value);
	      }
	    }
	    return result;
	  };

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true, []));
	  };

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    if (array == null) return [];
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = array.length; i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };

	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(slice.call(arguments, 1), true, true, []);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function(array) {
	    if (array == null) return [];
	    var length = _.max(arguments, 'length').length;
	    var results = Array(length);
	    for (var i = 0; i < length; i++) {
	      results[i] = _.pluck(arguments, i);
	    }
	    return results;
	  };

	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    if (list == null) return {};
	    var result = {};
	    for (var i = 0, length = list.length; i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };

	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = function(array, item, isSorted) {
	    if (array == null) return -1;
	    var i = 0, length = array.length;
	    if (isSorted) {
	      if (typeof isSorted == 'number') {
	        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
	      } else {
	        i = _.sortedIndex(array, item);
	        return array[i] === item ? i : -1;
	      }
	    }
	    for (; i < length; i++) if (array[i] === item) return i;
	    return -1;
	  };

	  _.lastIndexOf = function(array, item, from) {
	    if (array == null) return -1;
	    var idx = array.length;
	    if (typeof from == 'number') {
	      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
	    }
	    while (--idx >= 0) if (array[idx] === item) return idx;
	    return -1;
	  };

	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (arguments.length <= 1) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;

	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);

	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }

	    return range;
	  };

	  // Function (ahem) Functions
	  // ------------------

	  // Reusable constructor function for prototype setting.
	  var Ctor = function(){};

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    var args, bound;
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    args = slice.call(arguments, 2);
	    bound = function() {
	      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
	      Ctor.prototype = func.prototype;
	      var self = new Ctor;
	      Ctor.prototype = null;
	      var result = func.apply(self, args.concat(slice.call(arguments)));
	      if (_.isObject(result)) return result;
	      return self;
	    };
	    return bound;
	  };

	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    return function() {
	      var position = 0;
	      var args = boundArgs.slice();
	      for (var i = 0, length = args.length; i < length; i++) {
	        if (args[i] === _) args[i] = arguments[position++];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return func.apply(this, args);
	    };
	  };

	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };

	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = hasher ? hasher.apply(this, arguments) : key;
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };

	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = function(func) {
	    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
	  };

	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        clearTimeout(timeout);
	        timeout = null;
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;

	    var later = function() {
	      var last = _.now() - timestamp;

	      if (last < wait && last > 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };

	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }

	      return result;
	    };
	  };

	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };

	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };

	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };

	  // Returns a function that will only be executed after being called N times.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };

	  // Returns a function that will only be executed before being called N times.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      } else {
	        func = null;
	      }
	      return memo;
	    };
	  };

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);

	  // Object Functions
	  // ----------------

	  // Retrieve the names of an object's properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    return keys;
	  };

	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };

	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };

	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };

	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };

	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    var source, prop;
	    for (var i = 1, length = arguments.length; i < length; i++) {
	      source = arguments[i];
	      for (prop in source) {
	        if (hasOwnProperty.call(source, prop)) {
	            obj[prop] = source[prop];
	        }
	      }
	    }
	    return obj;
	  };

	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(obj, iteratee, context) {
	    var result = {}, key;
	    if (obj == null) return result;
	    if (_.isFunction(iteratee)) {
	      iteratee = createCallback(iteratee, context);
	      for (key in obj) {
	        var value = obj[key];
	        if (iteratee(value, key, obj)) result[key] = value;
	      }
	    } else {
	      var keys = concat.apply([], slice.call(arguments, 1));
	      obj = new Object(obj);
	      for (var i = 0, length = keys.length; i < length; i++) {
	        key = keys[i];
	        if (key in obj) result[key] = obj[key];
	      }
	    }
	    return result;
	  };

	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };

	  // Fill in a given object with default properties.
	  _.defaults = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    for (var i = 1, length = arguments.length; i < length; i++) {
	      var source = arguments[i];
	      for (var prop in source) {
	        if (obj[prop] === void 0) obj[prop] = source[prop];
	      }
	    }
	    return obj;
	  };

	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };

	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };

	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }
	    if (typeof a != 'object' || typeof b != 'object') return false;
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }
	    // Objects with different constructors are not equivalent, but `Object`s
	    // from different frames are.
	    var aCtor = a.constructor, bCtor = b.constructor;
	    if (
	      aCtor !== bCtor &&
	      // Handle Object.create(x) cases
	      'constructor' in a && 'constructor' in b &&
	      !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	        _.isFunction(bCtor) && bCtor instanceof bCtor)
	    ) {
	      return false;
	    }
	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);
	    var size, result;
	    // Recursively compare objects and arrays.
	    if (className === '[object Array]') {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      size = a.length;
	      result = size === b.length;
	      if (result) {
	        // Deep compare the contents, ignoring non-numeric properties.
	        while (size--) {
	          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
	        }
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      size = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      result = _.keys(b).length === size;
	      if (result) {
	        while (size--) {
	          // Deep compare each member
	          key = keys[size];
	          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
	        }
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return result;
	  };

	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b, [], []);
	  };

	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
	    for (var key in obj) if (_.has(obj, key)) return false;
	    return true;
	  };

	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };

	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };

	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };

	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });

	  // Define a fallback version of the method in browsers (ahem, IE), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }

	  // Optimize `isFunction` if appropriate. Work around an IE 11 bug.
	  if (true) {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }

	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };

	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };

	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };

	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };

	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };

	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };

	  // Utility Functions
	  // -----------------

	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };

	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };

	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };

	  _.noop = function(){};

	  _.property = function(key) {
	    return function(obj) {
	      return obj[key];
	    };
	  };

	  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
	  _.matches = function(attrs) {
	    var pairs = _.pairs(attrs), length = pairs.length;
	    return function(obj) {
	      if (obj == null) return !length;
	      obj = new Object(obj);
	      for (var i = 0; i < length; i++) {
	        var pair = pairs[i], key = pair[0];
	        if (pair[1] !== obj[key] || !(key in obj)) return false;
	      }
	      return true;
	    };
	  };

	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = createCallback(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };

	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };

	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };

	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);

	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);

	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property) {
	    if (object == null) return void 0;
	    var value = object[property];
	    return _.isFunction(value) ? object[property]() : value;
	  };

	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };

	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };

	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;

	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }

	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';

	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';

	    return template;
	  };

	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };

	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.

	  // Helper function to continue chaining intermediate results.
	  var result = function(obj) {
	    return this._chain ? _(obj).chain() : obj;
	  };

	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result.call(this, func.apply(_, args));
	      };
	    });
	  };

	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);

	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result.call(this, obj);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result.call(this, method.apply(this._wrapped, arguments));
	    };
	  });

	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };

	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ }
/******/ ])
});
