"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumSort = void 0;
exports.buildCmd = buildCmd;
exports.gitTagList = gitTagList;
exports.gitTagListSync = gitTagListSync;
exports._handleResult = _handleResult;
const spawn_1 = require("@git-lazy/spawn");
const util_1 = require("@git-lazy/spawn/lib/util");
const data_1 = require("@git-lazy/spawn/lib/data");
var EnumSort;
(function (EnumSort) {
    EnumSort["committerdate"] = "committerdate";
    EnumSort["taggerdate"] = "taggerdate";
    EnumSort["creatordate"] = "creatordate";
    EnumSort["refname"] = "refname";
})(EnumSort || (exports.EnumSort = EnumSort = {}));
function buildCmd(options) {
    options !== null && options !== void 0 ? options : (options = {});
    const args = [
        'tag',
        /**
         * 不加上格式的話會變成依照 TAG 名稱來排序
         */
        '--format',
        `;%(${"taggerdate" /* EnumSort.taggerdate */}:iso-strict)%09%09%(${"creatordate" /* EnumSort.creatordate */}:iso-strict)%09%09%(${"refname" /* EnumSort.refname */}:strip=2)`,
    ];
    let target = options.target;
    if (typeof target === 'undefined') {
        target = 'HEAD~20';
    }
    if (target) {
        args.push('--contains');
        args.push(target);
    }
    if (options.merged) {
        args.push('--merged');
        args.push(options.merged);
    }
    args.push('--sort');
    args.push(options.sort || "taggerdate" /* EnumSort.taggerdate */);
    return (0, util_1.filterCrossSpawnArgv)(args);
}
/**
 * @see https://gist.github.com/rponte/fdc0724dd984088606b0
 */
function gitTagList(options, spawnOptions) {
    var _a, _b;
    let cwd = (_b = (_a = options === null || options === void 0 ? void 0 : options.cwd) !== null && _a !== void 0 ? _a : spawnOptions === null || spawnOptions === void 0 ? void 0 : spawnOptions.cwd) !== null && _b !== void 0 ? _b : process.cwd();
    const args = buildCmd(options);
    return (0, spawn_1.crossSpawnGitAsync)("git", args, {
        ...spawnOptions,
        cwd,
    })
        .then(cp => {
        return (0, data_1.handleSpawnOutputArray)(cp.stdout.toString());
    })
        .then(_handleResult);
}
function gitTagListSync(options, spawnOptions) {
    var _a, _b;
    let cwd = (_b = (_a = options === null || options === void 0 ? void 0 : options.cwd) !== null && _a !== void 0 ? _a : spawnOptions === null || spawnOptions === void 0 ? void 0 : spawnOptions.cwd) !== null && _b !== void 0 ? _b : process.cwd();
    const args = buildCmd(options);
    const cp = (0, spawn_1.crossSpawnGitSync)("git", args, {
        ...spawnOptions,
        cwd,
    });
    return _handleResult((0, data_1.handleSpawnOutputArray)(cp.stdout.toString()));
}
function _handleResult(list) {
    return list.map(v => {
        let data = v
            .replace(/^;/, '')
            .split('\t\t');
        let date = new Date(data[0] || data[1]);
        return [data[2], date];
    })
        .reverse()
        // @ts-ignore
        .sort((a, b) => (b[1] - a[1]));
}
exports.default = gitTagList;
//# sourceMappingURL=index.js.map