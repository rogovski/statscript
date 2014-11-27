(function () {

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


}).call(this);
