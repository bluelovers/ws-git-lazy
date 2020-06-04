"use strict";
/**
 * Created by user on 2018/5/14/014.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterArgv = exports.gitDiffFrom = exports.defaultOptions = void 0;
const cross_spawn_extra_1 = __importDefault(require("cross-spawn-extra"));
const git_rev_range_1 = require("git-rev-range");
const upath2_1 = __importDefault(require("upath2"));
const crlf_normalize_1 = require("crlf-normalize");
const git_root2_1 = __importDefault(require("git-root2"));
const git_decode_1 = require("git-decode");
exports.defaultOptions = {
    encoding: 'UTF-8',
};
function gitDiffFrom(from = 'HEAD', to = 'HEAD', options = {}) {
    if (typeof to === 'object' && to !== null) {
        [options, to] = [to, 'HEAD'];
    }
    options = Object.assign({}, exports.defaultOptions, options);
    let cwd = git_rev_range_1.getCwd(options.cwd);
    let root = git_root2_1.default(cwd);
    if (!root) {
        throw new RangeError(`no exists git at ${cwd}`);
    }
    let opts2 = {
        cwd,
        realHash: true,
        gitlogOptions: {
            firstParent: true,
            displayFilesChangedDuringMerge: true,
        },
    };
    ({ from, to } = git_rev_range_1.revisionRangeData(from, to, opts2));
    let files = [];
    let list = [];
    if (from != to) {
        let log = cross_spawn_extra_1.default.sync('git', filterArgv([
            ...'diff-tree -r --no-commit-id --name-status'.split(' '),
            `--encoding=${options.encoding}`,
            git_rev_range_1.revisionRange(from, to, opts2),
        ]), {
            //stdio: 'inherit',
            cwd,
            stripAnsi: true,
        });
        if (log.error || log.stderr.length) {
            throw new Error(log.stderr.toString());
        }
        list = crlf_normalize_1.crlf(log.stdout.toString())
            .split(crlf_normalize_1.LF)
            .reduce(function (a, line) {
            line = line.replace(/^\s+/g, '');
            if (line) {
                let [status, file] = line.split(/\t/);
                /**
                 * 沒有正確回傳 utf-8 而是變成編碼化
                 */
                file = git_decode_1.decode2(file);
                let fullpath = upath2_1.default.join(root, file);
                file = upath2_1.default.relative(root, fullpath);
                let row = {
                    status,
                    path: file,
                    fullpath,
                };
                files.push(file);
                a.push(row);
            }
            return a;
        }, []);
    }
    cwd = upath2_1.default.resolve(cwd);
    root = upath2_1.default.resolve(root);
    return Object.assign(list, {
        from,
        to,
        cwd,
        root,
        files,
    });
}
exports.gitDiffFrom = gitDiffFrom;
function filterArgv(argv) {
    return argv.filter(function (v) {
        return v !== null && v !== '';
    });
}
exports.filterArgv = filterArgv;
exports.default = gitDiffFrom;
//# sourceMappingURL=index.js.map