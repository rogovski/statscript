(function () {

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


}).call(this);
