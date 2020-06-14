"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lazyUnParse = exports.kebabCaseObject = void 0;
const lodash_1 = require("lodash");
const yargs_unparser_1 = __importDefault(require("yargs-unparser"));
function kebabCaseObject(data) {
    return Object.entries(data)
        .reduce((a, [k, v]) => {
        // @ts-ignore
        a[lodash_1.kebabCase(k)] = v;
        return a;
    }, {});
}
exports.kebabCaseObject = kebabCaseObject;
function lazyUnParse(data, options) {
    if (!(options === null || options === void 0 ? void 0 : options.noKebabCase)) {
        data = kebabCaseObject(data);
    }
    return yargs_unparser_1.default(data);
}
exports.lazyUnParse = lazyUnParse;
exports.default = lazyUnParse;
//# sourceMappingURL=index.js.map