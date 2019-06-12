"use strict";
/**
 * Created by user on 2019/1/6/006.
 */
exports.__esModule = true;
var array_hyper_unique_1 = require("array-hyper-unique");
var debug0 = require("debug");
var fs_1 = require("fs");
var git_decode_1 = require("git-decode");
var type_1 = require("./type");
var extend = require("lodash.assign");
var _decamelize = require("decamelize");
var sortObjectKeys = require("sort-object-keys2");
var crlf_normalize_1 = require("crlf-normalize");
exports.debug = debug0('gitlog');
function handleOptions(options) {
    // lazy name
    var REPO = (options.repo && options.repo != null) ? options.repo : options.cwd;
    if (!REPO)
        throw new Error("Repo required!, but got \"" + REPO + "\"");
    if (!fs_1.existsSync(REPO))
        throw new Error("Repo location does not exist: \"" + REPO + "\"");
    var defaultExecOptions = {
        cwd: REPO,
        stripAnsi: true,
    };
    // Set defaults
    options = extend({}, type_1.defaultOptions, { execOptions: defaultExecOptions }, options);
    options.execOptions = extend(options.execOptions, defaultExecOptions);
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
    var bin = 'git';
    var commands = [
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
        var ls = [options.file].concat(options.files || []).filter(function (v) { return v != null; });
        if (!ls.length) {
            throw new TypeError("file list is empty");
        }
        commands = addFlagsBool(commands, options, [
            'follow',
        ]);
        commands.push.apply(commands, ['--'].concat(ls));
    }
    else if (options.follow) {
        throw new TypeError("options.follow works only for a single file");
    }
    exports.debug('command', options.execOptions, commands);
    return { bin: bin, commands: commands };
}
exports.buildCommands = buildCommands;
function addPrettyFormat(commands, options, flagName) {
    if (flagName === void 0) { flagName = "pretty" /* PRETTY */; }
    // Start of custom format
    // Iterating through the fields and adding them to the custom format
    var command = options.fields.reduce(function (command, field) {
        if (!type_1.fields[field] && type_1.notOptFields.indexOf(field) === -1)
            throw new RangeError('Unknown field: ' + field);
        command.push("\t" /* DELIMITER */ + type_1.fields[field]);
        return command;
    }, [toFlag(flagName) + "=" + "@begin@" /* BEGIN */])
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
    return _decamelize(key, '-');
}
exports.decamelize = decamelize;
function toFlag(key) {
    return '--' + decamelize(key);
}
exports.toFlag = toFlag;
function addFlagsBool(commands, options, flagNames) {
    for (var _i = 0, flagNames_1 = flagNames; _i < flagNames_1.length; _i++) {
        var k = flagNames_1[_i];
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
    var cmdOptional = ['author', 'since', 'after', 'until', 'before', 'committer', 'skip'];
    for (var _i = 0, cmdOptional_1 = cmdOptional; _i < cmdOptional_1.length; _i++) {
        var k = cmdOptional_1[_i];
        if (options[k]) {
            commands.push("--" + k + "=" + options[k]);
        }
    }
    return commands;
}
exports.addOptional = addOptional;
function parseCommitFields(parsed, commitField, index, fields) {
    var key = fields[index];
    switch (key) {
        case 'tags':
            var tags_1 = [];
            var start = commitField.indexOf('tag: ');
            if (start >= 0) {
                commitField
                    .substr(start + 5)
                    .trim()
                    .split(',')
                    .forEach(function (tag) {
                    tags_1.push(tag.trim());
                });
            }
            parsed[key] = tags_1;
            break;
        case 'authorDateUnixTimestamp':
        case 'committerDateUnixTimestamp':
            parsed[key] = parseInt(commitField);
            break;
        default:
            parsed[key] = commitField;
            break;
    }
    return parsed;
}
exports.parseCommitFields = parseCommitFields;
function parseCommits(commits, options) {
    var fields = options.fields, nameStatus = options.nameStatus;
    return commits.map(function (_commit, _index) {
        //console.log(_commit);
        var parts = _commit.split("@end@" /* END */);
        var commit = parts[0].split(type_1.delimiter);
        var nameStatusFiles = [];
        if (parts[1]) {
            var parseNameStatus = parts[1].trimLeft().split(crlf_normalize_1.LF);
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
                var tempArr = [b[0], b[b.length - 1]];
                tempArr[1] = decode(tempArr[1]);
                // @ts-ignore
                nameStatusFiles.push(tempArr);
                // If any files in between loop through them
                for (var i = 1, len = b.length - 1; i < len; i++) {
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
        var parsed = {
            _index: _index,
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
                    var pos = (index - fields.length) % type_1.notOptFields.length;
                    exports.debug('nameStatus', (index - fields.length), type_1.notOptFields.length, pos, commitField);
                    parsed[type_1.notOptFields[pos]].push(commitField);
                }
            }
        });
        if (nameStatus && options.nameStatusFiles) {
            parsed.fileStatus = array_hyper_unique_1.array_unique(nameStatusFiles);
        }
        // @ts-ignore
        parsed = sortObjectKeys(parsed, type_1.KEY_ORDER);
        return parsed;
    });
}
exports.parseCommits = parseCommits;
function parseCommitsStdout(options, stdout) {
    var str;
    exports.debug('stdout', stdout);
    if (options.fnHandleBuffer) {
        str = options.fnHandleBuffer(stdout);
    }
    else {
        str = stdout.toString();
    }
    //console.log(str);
    var commits = str.split("@begin@" /* BEGIN */);
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
    var e = message instanceof Error ? message : new err(message);
    // @ts-ignore
    e.data = data;
    // @ts-ignore
    return e;
}
exports.createError = createError;
// @ts-ignore
Object.freeze(exports);
