(function () {

    'use strict';

    var T        = require('../utility/tuple.js'),
        _ss      = require('../utility/collection.js'),
        _        = require('underscore'),
        constant = require('../numeric/constants.js');


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


}).call(this);
