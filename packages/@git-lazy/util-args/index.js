"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kebabCaseObject = kebabCaseObject;
exports.lazyUnParse = lazyUnParse;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const yargs_unparser_1 = tslib_1.__importDefault(require("yargs-unparser"));
function kebabCaseObject(data) {
    return Object.entries(data)
        .reduce((a, [k, v]) => {
        // @ts-ignore
        a[(0, lodash_1.kebabCase)(k)] = v;
        return a;
    }, {});
}
function lazyUnParse(data, options) {
    if (!(options === null || options === void 0 ? void 0 : options.noKebabCase)) {
        data = kebabCaseObject(data);
    }
    return (0, yargs_unparser_1.default)(data);
}
exports.default = lazyUnParse;
//# sourceMappingURL=index.js.map