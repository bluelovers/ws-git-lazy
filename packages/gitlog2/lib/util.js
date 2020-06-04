"use strict";
/**
 * Created by user on 2019/1/6/006.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.parseCommitsStdout = exports.parseCommits = exports.parseCommitFields = exports.addOptional = exports.addFlagsBool = exports.toFlag = exports.decamelize = exports.decode = exports.addPrettyFormat = exports.buildCommands = exports.handleOptions = exports.debug = void 0;
const array_hyper_unique_1 = require("array-hyper-unique");
const debug_1 = __importDefault(require("debug"));
const fs_1 = require("fs");
const git_decode_1 = require("git-decode");
const type_1 = require("./type");
const lodash_assign_1 = __importDefault(require("lodash.assign"));
const decamelize_1 = __importDefault(require("decamelize"));
const sort_object_keys2_1 = __importDefault(require("sort-object-keys2"));
const crlf_normalize_1 = require("crlf-normalize");
const util_1 = require("@git-lazy/spawn/lib/util");
exports.debug = debug_1.default('gitlog');
function handleOptions(options) {
    // lazy name
    const REPO = (options.repo && options.repo != null) ? options.repo : options.cwd;
    if (!REPO)
        throw new Error(`Repo required!, but got "${REPO}"`);
    if (!fs_1.existsSync(REPO))
        throw new Error(`Repo location does not exist: "${REPO}"`);
    let defaultExecOptions = {
        cwd: REPO,
        stripAnsi: true,
    };
    // Set defaults
    options = lodash_assign_1.default({}, type_1.defaultOptions, { execOptions: defaultExecOptions }, options);
    options.execOptions = lodash_assign_1.default(options.execOptions, defaultExecOptions);
    if (options.returnAllFields) {
        options.fields = [].concat(Object.keys(type_1.fields));
        if (options.nameStatus && typeof options.nameStatusFiles == 'undefined') {
            options.nameStatusFiles = true;
        }
    }
    return options;
}
exports.handleOptions = handleOptions;
function buildCommands(options) {
    // Start constructing command
    let bin = 'git';
    let commands = [
        'log',
    ];
    commands = addFlagsBool(commands, options, [
        'findCopiesHarder',
        'all',
    ]);
    if (options.number > 0) {
        commands.push('-n', options.number);
    }
    commands = addFlagsBool(commands, options, [
        'noMerges',
        'firstParent',
    ]);
    if (options.displayFilesChangedDuringMerge) {
        commands.push('-m');
    }
    commands = addOptional(commands, options);
    commands = addPrettyFormat(commands, options, "pretty" /* PRETTY */);
    // Append branch (revision range) if specified
    if (options.branch) {
        commands.push(options.branch);
    }
    //File and file status
    commands = addFlagsBool(commands, options, [
        'nameStatus',
        'merges',
        'fullHistory',
        'sparse',
        'simplifyMerges',
    ]);
    if (options.file || options.files && options.files.length) {
        let ls = [options.file].concat(options.files || []).filter(v => v != null);
        if (!ls.length) {
            throw new TypeError(`file list is empty`);
        }
        commands = addFlagsBool(commands, options, [
            'follow',
        ]);
        commands.push('--', ...ls);
    }
    else if (options.follow) {
        throw new TypeError(`options.follow works only for a single file`);
    }
    exports.debug('command', options.execOptions, commands);
    return { bin, commands };
}
exports.buildCommands = buildCommands;
function addPrettyFormat(commands, options, flagName = "pretty" /* PRETTY */) {
    // Start of custom format
    // Iterating through the fields and adding them to the custom format
    let command = options.fields.reduce(function (command, field) {
        if (!type_1.fields[field] && type_1.notOptFields.indexOf(field) === -1)
            throw new RangeError('Unknown field: ' + field);
        command.push("\t" /* DELIMITER */ + type_1.fields[field]);
        return command;
    }, [`${toFlag(flagName)}=${"@begin@" /* BEGIN */}`])
        .concat(["@end@" /* END */])
        .join("" /* JOIN */);
    commands.push(command);
    return commands;
}
exports.addPrettyFormat = addPrettyFormat;
function decode(file) {
    if (file.indexOf('"') == 0 || file.match(/(?:\\(\d{3}))/)) {
        file = file.replace(/^"|"$/g, '');
        file = git_decode_1.decode(file);
    }
    return file;
}
exports.decode = decode;
function decamelize(key) {
    return decamelize_1.default(key, '-');
}
exports.decamelize = decamelize;
function toFlag(key) {
    return '--' + decamelize(key);
}
exports.toFlag = toFlag;
function addFlagsBool(commands, options, flagNames) {
    for (let k of flagNames) {
        if (options[k]) {
            commands.push(toFlag(k));
        }
    }
    return commands;
}
exports.addFlagsBool = addFlagsBool;
/***
 Add optional parameter to command
 */
function addOptional(commands, options) {
    let cmdOptional = ['author', 'since', 'after', 'until', 'before', 'committer', 'skip'];
    for (let k of cmdOptional) {
        if (options[k]) {
            commands.push(`--${k}=${options[k]}`);
        }
    }
    return commands;
}
exports.addOptional = addOptional;
function parseCommitFields(parsed, commitField, index, fields) {
    let key = fields[index];
    switch (key) {
        case 'tags':
            let tags = [];
            let start = commitField.indexOf('tag: ');
            if (start >= 0) {
                commitField
                    .substr(start + 5)
                    .trim()
                    .split(',')
                    .forEach(function (tag) {
                    tags.push(tag.trim());
                });
            }
            parsed[key] = tags;
            break;
        case 'authorDateUnixTimestamp':
        case 'committerDateUnixTimestamp':
            parsed[key] = parseInt(commitField);
            break;
        default:
            // @ts-ignore
            parsed[key] = commitField;
            break;
    }
    return parsed;
}
exports.parseCommitFields = parseCommitFields;
function parseCommits(commits, options) {
    let { fields, nameStatus } = options;
    return commits.map(function (_commit, _index) {
        //console.log(_commit);
        let parts = _commit.split("@end@" /* END */);
        let commit = parts[0].split(type_1.delimiter);
        let nameStatusFiles = [];
        if (parts[1]) {
            let parseNameStatus = parts[1].trimLeft().split(crlf_normalize_1.LF);
            // Removes last empty char if exists
            if (parseNameStatus[parseNameStatus.length - 1] === '') {
                parseNameStatus.pop();
            }
            parseNameStatus = parseNameStatus
                // Split each line into it's own delimitered array
                .map(function (d, i) {
                return d.split(type_1.delimiter);
            })
                // 0 will always be status, last will be the filename as it is in the commit,
                // anything inbetween could be the old name if renamed or copied
                .reduce(function (a, b) {
                let tempArr = [b[0], b[b.length - 1]];
                tempArr[1] = decode(tempArr[1]);
                // @ts-ignore
                nameStatusFiles.push(tempArr);
                // If any files in between loop through them
                for (let i = 1, len = b.length - 1; i < len; i++) {
                    // If status R then add the old filename as a deleted file + status
                    // Other potentials are C for copied but this wouldn't require the original deleting
                    if (b[0].slice(0, 1) === type_1.EnumFileStatus.RENAMED) {
                        tempArr.push(type_1.EnumFileStatus.DELETED, b[i]);
                        // @ts-ignore
                        nameStatusFiles.push([type_1.EnumFileStatus.DELETED, decode(b[i])]);
                    }
                }
                return a.concat(tempArr);
            }, []);
            commit = commit.concat(parseNameStatus);
        }
        exports.debug('commit', commit);
        // Remove the first empty char from the array
        commit.shift();
        let parsed = {
            _index,
        };
        if (nameStatus) {
            // Create arrays for non optional fields if turned on
            type_1.notOptFields.forEach(function (d) {
                parsed[d] = [];
            });
        }
        commit.forEach(function (commitField, index) {
            if (fields[index]) {
                parsed = parseCommitFields(parsed, commitField, index, fields);
            }
            else {
                if (nameStatus) {
                    let pos = (index - fields.length) % type_1.notOptFields.length;
                    exports.debug('nameStatus', (index - fields.length), type_1.notOptFields.length, pos, commitField);
                    parsed[type_1.notOptFields[pos]].push(commitField);
                }
            }
        });
        if (nameStatus && options.nameStatusFiles) {
            parsed.fileStatus = array_hyper_unique_1.array_unique(nameStatusFiles);
        }
        // @ts-ignore
        parsed = sort_object_keys2_1.default(parsed, type_1.KEY_ORDER);
        return parsed;
    });
}
exports.parseCommits = parseCommits;
function parseCommitsStdout(options, stdout) {
    let str;
    exports.debug('stdout', stdout);
    if (options.fnHandleBuffer) {
        str = options.fnHandleBuffer(stdout);
    }
    else {
        str = util_1.crossSpawnOutput(stdout);
    }
    //console.log(str);
    let commits = str.split("@begin@" /* BEGIN */);
    if (commits[0] === '') {
        commits.shift();
    }
    exports.debug('commits', commits);
    commits = parseCommits(commits, options);
    exports.debug('commits:parsed', commits);
    return commits;
}
exports.parseCommitsStdout = parseCommitsStdout;
function createError(message, data, err) {
    // @ts-ignore
    err = err || Error;
    let e = message instanceof Error ? message : new err(message);
    // @ts-ignore
    e.data = data;
    // @ts-ignore
    return e;
}
exports.createError = createError;
//# sourceMappingURL=util.js.map