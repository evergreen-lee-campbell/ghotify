"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j])
                arr.splice(j--, 1);
        }
    }
    return arr;
});
//# sourceMappingURL=deduplicateArray.js.map