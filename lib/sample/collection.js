(function () {

    'use strict';

    var T        = require('../utility/tuple.js'),
        _ss      = require('../utility/collection.js'),
        _        = require('underscore'),
        kbn      = require('../numeric/kbn.js');


        function _kbn_sum (ls) {
            return kbn.sum( kbn.unpack, ls );
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


}).call(this);
