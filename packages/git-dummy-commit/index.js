'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitDummyCommit = exports.defaultMsg = void 0;
const spawn_1 = require("@git-lazy/spawn");
const defaultMsg = 'Test commit';
exports.defaultMsg = defaultMsg;
function makeDefault(str, options) {
    var _a, _b;
    return !((_a = str === null || str === void 0 ? void 0 : str.replace(/^\s+|\s+$/g, '')) === null || _a === void 0 ? void 0 : _a.length)
        ? ((_b = options === null || options === void 0 ? void 0 : options.defaultMsg) !== null && _b !== void 0 ? _b : defaultMsg)
        : str;
}
function gitDummyCommit(msg, options) {
    var _a;
    let args = [];
    if (typeof msg === 'object' && !Array.isArray(msg)) {
        options = msg;
        msg = options.msg;
    }
    if (Array.isArray(msg)) {
        if (msg.length > 0) {
            args = msg
                .map(m => makeDefault(m, options))
                .reduce((messages, m) => {
                messages.push('-m');
                messages.push(m);
                return messages;
            }, args);
        }
        else {
            args = ['-m', defaultMsg];
        }
    }
    else {
        args = ['-m', makeDefault(msg, options)];
    }
    const cwd = (_a = options === null || options === void 0 ? void 0 : options.cwd) !== null && _a !== void 0 ? _a : process.cwd();
    return spawn_1.crossSpawnGitSync('git', [
        'commit',
        ...args,
        '--allow-empty',
        '--no-gpg-sign'
    ], {
        cwd,
        stdio: (options === null || options === void 0 ? void 0 : options.silent) === false ? 'inherit' : void 0
    });
}
exports.gitDummyCommit = gitDummyCommit;
exports.default = gitDummyCommit;
//# sourceMappingURL=index.js.map