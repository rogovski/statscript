

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



