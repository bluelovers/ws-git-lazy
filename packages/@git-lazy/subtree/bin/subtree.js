#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const __1 = require("..");
const core_1 = require("../lib/core");
const logger_1 = __importDefault(require("debug-color2/logger"));
const debug_1 = __importStar(require("@git-lazy/debug"));
const package_json_1 = require("../package.json");
const split_1 = require("../lib/core/split");
const yesno_1 = __importDefault(require("yesno"));
let cli = yargs_1.default
    .option('prefix', {
    alias: ['P'],
    string: true,
    demandOption: true,
})
    .option('remote', {
    string: true,
})
    .option('name', {
    string: true,
})
    .option('branch', {
    alias: ['b'],
    string: true,
})
    .option('squash', {
    boolean: true,
})
    .option('cwd', {
    string: true,
    normalize: true,
    default: process.cwd(),
})
    .option('squash', {
    boolean: true,
})
    .option('version', {
    alias: ['v'],
    boolean: true,
})
    .option('help', {
    alias: ['h'],
    boolean: true,
})
    .option('disableExec', {
    boolean: true,
});
cli = _setup_cmd(cli, __1.EnumSubtreeCmd.add);
cli = _setup_cmd(cli, __1.EnumSubtreeCmd.pull);
cli = _setup_cmd(cli, __1.EnumSubtreeCmd.push);
cli = _setup_cmd(cli, __1.EnumSubtreeCmd.split);
cli
    .strict(false)
    .help()
    .showHelpOnFail(true)
    .version('v')
    .demandCommand()
    .command('$0', '', (yargs) => {
    if (yargs.argv.help || yargs.argv.h) {
        return yargs.showHelp('info');
    }
    else if (yargs.argv.version || yargs.argv.v) {
        return debug_1.default.log(`${package_json_1.version}`);
    }
    debug_1.debug.log(yargs.argv);
    yargs.showHelp();
})
    .argv;
function _setup_cmd(yargs, cmd) {
    let aliases = [cmd];
    if (cmd === __1.EnumSubtreeCmd.add) {
        aliases = [cmd, 'clone', 'init'];
    }
    aliases.map(cmd => `${cmd} [remote] [branch]`);
    yargs
        .command(aliases, ``, (yargs) => {
        if (cmd === __1.EnumSubtreeCmd.split) {
            yargs = yargs
                .option('rejoin', {
                boolean: true,
            })
                .option('ignoreJoins', {
                boolean: true,
            });
        }
        if (yargs.argv.help || yargs.argv.h) {
            return yargs.showHelp();
        }
        else if (yargs.argv.version || yargs.argv.v) {
            return debug_1.default.log(`${package_json_1.version}`);
        }
        return _builder(cmd, yargs);
    });
    return yargs;
}
async function _builder(cmd, yargs) {
    var _a;
    const argv = yargs.argv;
    let { remote, branch, prefix, cwd, name, _, $0, disableExec, ...args_plus } = argv;
    _ = _.slice(1);
    if (cmd !== __1.EnumSubtreeCmd.split) {
        remote = (_a = remote !== null && remote !== void 0 ? remote : name) !== null && _a !== void 0 ? _a : _.shift();
    }
    branch = branch !== null && branch !== void 0 ? branch : _.shift();
    delete args_plus.P;
    delete args_plus.h;
    delete args_plus.v;
    delete args_plus.b;
    delete args_plus.disableExec;
    delete args_plus['disable-exec'];
    let options = {
        ...args_plus,
        cwd,
        remote,
        name,
        branch,
        prefix,
    };
    debug_1.debug.log(options);
    let opts;
    let command;
    if (cmd === __1.EnumSubtreeCmd.split) {
        opts = split_1.handleOptionsSplit(options);
        command = `git ${split_1.unparseCmdSplit(cmd, opts).join(' ')}`;
    }
    else {
        opts = core_1.handleOptions(options);
        command = `git ${core_1.unparseCmd(cmd, opts).join(' ')}`;
    }
    if (argv.disableExec) {
        debug_1.default.log(command);
    }
    else {
        logger_1.default.debug(`[GIT]`, opts.root);
        logger_1.default.debug(`[CWD]`, opts.cwd);
        logger_1.default.debug(command);
        if (cmd === __1.EnumSubtreeCmd.split) {
            if (!opts.branch) {
                const ok = await yesno_1.default({
                    question: 'Are you sure you want to continue with no branch?',
                });
                if (!ok) {
                    return yargs.exit(1, new Error(`user cancel`));
                }
            }
            else if (opts.branch === 'master') {
                const ok = await yesno_1.default({
                    question: `Are you sure you want to continue with branch => ${opts.branch}?`,
                });
                if (!ok) {
                    return yargs.exit(1, new Error(`user cancel`));
                }
            }
            split_1._cmdSplit(cmd, opts);
        }
        else {
            core_1._cmd(cmd, opts);
        }
    }
}
//# sourceMappingURL=subtree.js.map