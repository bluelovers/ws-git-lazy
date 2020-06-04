"use strict";
/**
 * Created by user on 2020/6/4.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapQuote = exports.removeQuote = exports.isQuote = void 0;
function isQuote(input) {
    return /^(["'])(.+)\1$/g.test(input);
}
exports.isQuote = isQuote;
function removeQuote(input) {
    return input.replace(/^(["'])(.+)\1$/g, '$2');
}
exports.removeQuote = removeQuote;
function wrapQuote(input, quote = '"') {
    if (!isQuote(input)) {
        return `${quote}${input}${quote}`;
    }
    return input;
}
exports.wrapQuote = wrapQuote;
//# sourceMappingURL=util.js.map