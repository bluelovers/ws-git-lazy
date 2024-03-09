"use strict";
/**
 * Created by user on 2020/6/4.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isQuote = isQuote;
exports.removeQuote = removeQuote;
exports.wrapQuote = wrapQuote;
function isQuote(input) {
    return /^(["'])(.+)\1$/g.test(input);
}
function removeQuote(input) {
    return input.replace(/^(["'])(.+)\1$/g, '$2');
}
function wrapQuote(input, quote = '"') {
    if (!isQuote(input)) {
        return `${quote}${input}${quote}`;
    }
    return input;
}
//# sourceMappingURL=util.js.map