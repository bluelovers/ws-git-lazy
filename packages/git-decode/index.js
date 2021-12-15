"use strict";
/**
 * Created by user on 2018/5/15/015.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode2 = exports.decode = exports.encode = void 0;
const tslib_1 = require("tslib");
const uni_string_1 = tslib_1.__importDefault(require("uni-string"));
const util_1 = require("./lib/util");
function encode(s) {
    return uni_string_1.default.split(s, '')
        .map(function (v) {
        let s = Buffer.from(v);
        if (s.length > 1 || (s.length == 1 && s[0] >= 0x7F)) {
            let t = '';
            for (let b of s.entries()) {
                t = t + '\\' + b[1].toString(8);
            }
            return t;
        }
        return v;
    })
        .join('');
}
exports.encode = encode;
function decode(s) {
    let matches = [];
    let t = '';
    let i2 = 0, b = [];
    let arr;
    let r = /(?:\\(\d{3}))/g;
    while (arr = r.exec(s)) {
        //let extras = arr.splice(-2);
        /*
         arr.i2 = i2;
         arr.lastIndex = r.lastIndex;
         console.log([arr, s.length, t, b, s.substr(i2, arr.index)]);
         */
        if (i2 != arr.index) {
            if (b.length) {
                t += Buffer.from(b).toString();
                b = [];
            }
            t += s.substr(i2, arr.index - i2);
        }
        //i2 = arr.index + arr[0].length;
        i2 = r.lastIndex;
        b.push(parseInt(arr[1], 8));
    }
    //console.log([t, b]);
    if (b.length) {
        t += Buffer.from(b).toString();
        b = [];
    }
    if (i2 > -1 && i2 < s.length) {
        t += s.substr(i2, s.length - i2);
    }
    return t;
}
exports.decode = decode;
function decode2(input) {
    if (/(?:\\(\d{3}))/.test(input)) {
        input = decode(input);
    }
    return (0, util_1.removeQuote)(input);
}
exports.decode2 = decode2;
exports.default = exports;
//# sourceMappingURL=index.js.map