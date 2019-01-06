"use strict";
/**
 * Created by user on 2019/1/6/006.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const array_hyper_unique_1 = require("array-hyper-unique");
const debug0 = require("debug");
const fs_1 = require("fs");
const git_decode_1 = require("git-decode");
const type_1 = require("./type");
const extend = require("lodash.assign");
const _decamelize = require("decamelize");
const sortObjectKeys = require("sort-object-keys2");
const crlf_normalize_1 = require("crlf-normalize");
exports.debug = debug0('gitlog');
function handleOptions(options) {
    // lazy name
    const REPO = typeof options.repo != 'undefined' ? options.repo : options.cwd;
    if (!REPO)
        throw new Error(`Repo required!, but got "${REPO}"`);
    if (!fs_1.existsSync(REPO))
        throw new Error(`Repo location does not exist: "${REPO}"`);
    let defaultExecOptions = {
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
    commands = addOptional(commands, options);
    {
        commands = addPrettyFormat(commands, options, "pretty" /* PRETTY */);
    }
    // Append branch (revision range) if specified
    if (options.branch) {
        commands.push(options.branch);
    }
    if (options.file) {
        commands.push('--', options.file);
        commands = addFlagsBool(commands, options, [
            'follow',
        ]);
    }
    else if (options.follow) {
        throw new TypeError(`options.follow works only for a single file`);
    }
    //File and file status
    commands = addFlagsBool(commands, options, [
        'nameStatus',
    ]);
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
    return _decamelize(key, '-');
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
    let cmdOptional = ['author', 'since', 'after', 'until', 'before', 'committer'];
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
            parsed[key] = commitField;
            break;
    }
    return parsed;
}
exports.parseCommitFields = parseCommitFields;
function parseCommits(commits, options) {
    let { fields, nameStatus } = options;
    return commits.map(function (_commit, _index) {
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
        parsed = sortObjectKeys(parsed, type_1.KEY_ORDER);
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
        str = stdout.toString();
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
// @ts-ignore
Object.freeze(exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOztBQUVILDJEQUFrRDtBQUNsRCxnQ0FBaUM7QUFDakMsMkJBQWdDO0FBQ2hDLDJDQUErQztBQUMvQyxpQ0FVZ0I7QUFDaEIsd0NBQXlDO0FBQ3pDLDBDQUEyQztBQUMzQyxvREFBcUQ7QUFFckQsbURBQW9DO0FBRXZCLFFBQUEsS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUV0QyxTQUFnQixhQUFhLENBQUMsT0FBaUI7SUFFOUMsWUFBWTtJQUNaLE1BQU0sSUFBSSxHQUFHLE9BQU8sT0FBTyxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFFN0UsSUFBSSxDQUFDLElBQUk7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2hFLElBQUksQ0FBQyxlQUFVLENBQUMsSUFBSSxDQUFDO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUVsRixJQUFJLGtCQUFrQixHQUFxQjtRQUMxQyxHQUFHLEVBQUUsSUFBSTtRQUNULFNBQVMsRUFBRSxJQUFJO0tBQ2YsQ0FBQztJQUVGLGVBQWU7SUFDZixPQUFPLEdBQUcsTUFBTSxDQUFDLEVBQUUsRUFBRSxxQkFBYyxFQUFFLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkYsT0FBTyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBRXRFLElBQUksT0FBTyxDQUFDLGVBQWUsRUFDM0I7UUFDQyxPQUFPLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxN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RUQ7UUFDQyxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFBO0tBQ3ZCO0lBRUQsbUJBQW1CO0lBRW5CLElBQUksT0FBTyxHQUFjLEdBQUcsQ0FBQyxLQUFLLHVCQUE0QixDQUFDO0lBQy9ELElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFDckI7UUFDQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDZjtJQUNELGFBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFMUIsT0FBTyxHQUFHLFlBQVksQ0FBQyxPQUFtQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRXJELGFBQUssQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVqQyxPQUFPLE9BQXlCLENBQUM7QUFDbEMsQ0FBQztBQTdCRCxnREE2QkM7QUFRRCxTQUFnQixXQUFXLENBQWlDLE9BQVEsRUFBRSxJQUFRLEVBQUUsR0FHL0U7SUFJQSxhQUFhO0lBQ2IsR0FBRyxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUM7SUFFbkIsSUFBSSxDQUFDLEdBQUcsT0FBTyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUU5RCxhQUFhO0lBQ2IsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFFZCxhQUFhO0lBQ2IsT0FBTyxDQUFDLENBQUM7QUFDVixDQUFDO0FBakJELGtDQWlCQztBQUVELGFBQWE7QUFDYixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOS8xLzYvMDA2LlxuICovXG5cbmltcG9ydCB7IGFycmF5X3VuaXF1ZSB9IGZyb20gJ2FycmF5LWh5cGVyLXVuaXF1ZSc7XG5pbXBvcnQgZGVidWcwID0gcmVxdWlyZSgnZGVidWcnKTtcbmltcG9ydCB7IGV4aXN0c1N5bmMgfSBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IGRlY29kZSBhcyBfZGVjb2RlIH0gZnJvbSAnZ2l0LWRlY29kZSc7XG5pbXBvcnQge1xuXHRkZWZhdWx0T3B0aW9ucyxcblx0ZGVsaW1pdGVyLCBFbnVtRmlsZVN0YXR1cywgRW51bVByZXR0eUZvcm1hdEZsYWdzLCBFbnVtUHJldHR5Rm9ybWF0TWFyayxcblx0ZmllbGRzLFxuXHRJQ29tbWFuZHMsIElGaWVsZHNBcnJheSxcblx0SU9wdGlvbnMsXG5cdElQYXJzZUNvbW1pdCxcblx0SVJldHVybkNvbW1pdHMsXG5cdEtFWV9PUkRFUixcblx0bm90T3B0RmllbGRzLFxufSBmcm9tICcuL3R5cGUnO1xuaW1wb3J0IGV4dGVuZCA9IHJlcXVpcmUoJ2xvZGFzaC5hc3NpZ24nKTtcbmltcG9ydCBfZGVjYW1lbGl6ZSA9IHJlcXVpcmUoJ2RlY2FtZWxpemUnKTtcbmltcG9ydCBzb3J0T2JqZWN0S2V5cyA9IHJlcXVpcmUoJ3NvcnQtb2JqZWN0LWtleXMyJyk7XG5pbXBvcnQgeyBTcGF3blN5bmNPcHRpb25zIH0gZnJvbSAnY3Jvc3Mtc3Bhd24tZXh0cmEvY29yZSc7XG5pbXBvcnQgeyBMRiB9IGZyb20gJ2NybGYtbm9ybWFsaXplJztcblxuZXhwb3J0IGNvbnN0IGRlYnVnID0gZGVidWcwKCdnaXRsb2cnKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZU9wdGlvbnMob3B0aW9uczogSU9wdGlvbnMpXG57XG5cdC8vIGxhenkgbmFtZVxuXHRjb25zdCBSRVBPID0gdHlwZW9mIG9wdGlvbnMucmVwbyAhPSAndW5kZWZpbmVkJyA/IG9wdGlvbnMucmVwbyA6IG9wdGlvbnMuY3dkO1xuXG5cdGlmICghUkVQTykgdGhyb3cgbmV3IEVycm9yKGBSZXBvIHJlcXVpcmVkISwgYnV0IGdvdCBcIiR7UkVQT31cImApO1xuXHRpZiAoIWV4aXN0c1N5bmMoUkVQTykpIHRocm93IG5ldyBFcnJvcihgUmVwbyBsb2NhdGlvbiBkb2VzIG5vdCBleGlzdDogXCIke1JFUE99XCJgKTtcblxuXHRsZXQgZGVmYXVsdEV4ZWNPcHRpb25zOiBTcGF3blN5bmNPcHRpb25zID0ge1xuXHRcdGN3ZDogUkVQTyxcblx0XHRzdHJpcEFuc2k6IHRydWUsXG5cdH07XG5cblx0Ly8gU2V0IGRlZmF1bHRzXG5cdG9wdGlvbnMgPSBleHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCB7IGV4ZWNPcHRpb25zOiBkZWZhdWx0RXhlY09wdGlvbnMgfSwgb3B0aW9ucyk7XG5cdG9wdGlvbnMuZXhlY09wdGlvbnMgPSBleHRlbmQob3B0aW9ucy5leGVjT3B0aW9ucywgZGVmYXVsdEV4ZWNPcHRpb25zKTtcblxuXHRpZiAob3B0aW9ucy5yZXR1cm5BbGxGaWVsZHMpXG5cdHtcblx0XHRvcHRpb25zLmZpZWxkcyA9IFtdLmNvbmNhdChPYmplY3Qua2V5cyhmaWVsZHMpKTtcblxuXHRcdGlmIChvcHRpb25zLm5hbWVTdGF0dXMgJiYgdHlwZW9mIG9wdGlvbnMubmFtZVN0YXR1c0ZpbGVzID09ICd1bmRlZmluZWQnKVxuXHRcdHtcblx0XHRcdG9wdGlvbnMubmFtZVN0YXR1c0ZpbGVzID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gb3B0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQ29tbWFuZHMob3B0aW9uczogSU9wdGlvbnMpOiB7XG5cdGJpbjogc3RyaW5nLFxuXHRjb21tYW5kczogSUNvbW1hbmRzLFxufVxue1xuXHQvLyBTdGFydCBjb25zdHJ1Y3RpbmcgY29tbWFuZFxuXG5cdGxldCBiaW4gPSAnZ2l0Jztcblx0bGV0IGNvbW1hbmRzOiBJQ29tbWFuZHMgPSBbXG5cdFx0J2xvZycsXG5cdF07XG5cblx0Y29tbWFuZHMgPSBhZGRGbGFnc0Jvb2woY29tbWFuZHMsIG9wdGlvbnMsIFtcblx0XHQnZmluZENvcGllc0hhcmRlcicsXG5cdFx0J2FsbCcsXG5cdF0pO1xuXG5cdGlmIChvcHRpb25zLm51bWJlciA+IDApXG5cdHtcblx0XHRjb21tYW5kcy5wdXNoKCctbicsIG9wdGlvbnMubnVtYmVyKTtcblx0fVxuXG5cdGNvbW1hbmRzID0gYWRkRmxhZ3NCb29sKGNvbW1hbmRzLCBvcHRpb25zLCBbXG5cdFx0J25vTWVyZ2VzJyxcblx0XHQnZmlyc3RQYXJlbnQnLFxuXHRdKTtcblxuXHRjb21tYW5kcyA9IGFkZE9wdGlvbmFsKGNvbW1hbmRzLCBvcHRpb25zKTtcblxuXHR7XG5cdFx0Y29tbWFuZHMgPSBhZGRQcmV0dHlGb3JtYXQoY29tbWFuZHMsIG9wdGlvbnMsIEVudW1QcmV0dHlGb3JtYXRGbGFncy5QUkVUVFkpXG5cdH1cblxuXHQvLyBBcHBlbmQgYnJhbmNoIChyZXZpc2lvbiByYW5nZSkgaWYgc3BlY2lmaWVkXG5cdGlmIChvcHRpb25zLmJyYW5jaClcblx0e1xuXHRcdGNvbW1hbmRzLnB1c2gob3B0aW9ucy5icmFuY2gpO1xuXHR9XG5cblx0aWYgKG9wdGlvbnMuZmlsZSlcblx0e1xuXHRcdGNvbW1hbmRzLnB1c2goJy0tJywgb3B0aW9ucy5maWxlKTtcblxuXHRcdGNvbW1hbmRzID0gYWRkRmxhZ3NCb29sKGNvbW1hbmRzLCBvcHRpb25zLCBbXG5cdFx0XHQnZm9sbG93Jyxcblx0XHRdKTtcblx0fVxuXHRlbHNlIGlmIChvcHRpb25zLmZvbGxvdylcblx0e1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYG9wdGlvbnMuZm9sbG93IHdvcmtzIG9ubHkgZm9yIGEgc2luZ2xlIGZpbGVgKVxuXHR9XG5cblx0Ly9GaWxlIGFuZCBmaWxlIHN0YXR1c1xuXHRjb21tYW5kcyA9IGFkZEZsYWdzQm9vbChjb21tYW5kcywgb3B0aW9ucywgW1xuXHRcdCduYW1lU3RhdHVzJyxcblx0XSk7XG5cblx0ZGVidWcoJ2NvbW1hbmQnLCBvcHRpb25zLmV4ZWNPcHRpb25zLCBjb21tYW5kcyk7XG5cblx0cmV0dXJuIHsgYmluLCBjb21tYW5kcyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRQcmV0dHlGb3JtYXQoY29tbWFuZHM6IElDb21tYW5kcywgb3B0aW9uczogSU9wdGlvbnMsIGZsYWdOYW1lID0gRW51bVByZXR0eUZvcm1hdEZsYWdzLlBSRVRUWSlcbntcblx0Ly8gU3RhcnQgb2YgY3VzdG9tIGZvcm1hdFxuXHQvLyBJdGVyYXRpbmcgdGhyb3VnaCB0aGUgZmllbGRzIGFuZCBhZGRpbmcgdGhlbSB0byB0aGUgY3VzdG9tIGZvcm1hdFxuXHRsZXQgY29tbWFuZCA9IG9wdGlvbnMuZmllbGRzLnJlZHVjZShmdW5jdGlvbiAoY29tbWFuZCwgZmllbGQpXG5cdFx0e1xuXHRcdFx0aWYgKCFmaWVsZHNbZmllbGRdICYmIG5vdE9wdEZpZWxkcy5pbmRleE9mKGZpZWxkKSA9PT0gLTEpIHRocm93IG5ldyBSYW5nZUVycm9yKCdVbmtub3duIGZpZWxkOiAnICsgZmllbGQpO1xuXG5cdFx0XHRjb21tYW5kLnB1c2goRW51bVByZXR0eUZvcm1hdE1hcmsuREVMSU1JVEVSICsgZmllbGRzW2ZpZWxkXSk7XG5cblx0XHRcdHJldHVybiBjb21tYW5kO1xuXHRcdH0sIFtgJHt0b0ZsYWcoZmxhZ05hbWUpfT0ke0VudW1QcmV0dHlGb3JtYXRNYXJrLkJFR0lOfWBdKVxuXHRcdC5jb25jYXQoW0VudW1QcmV0dHlGb3JtYXRNYXJrLkVORF0pXG5cdFx0LmpvaW4oRW51bVByZXR0eUZvcm1hdE1hcmsuSk9JTik7XG5cblx0Y29tbWFuZHMucHVzaChjb21tYW5kKTtcblxuXHRyZXR1cm4gY29tbWFuZHNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZShmaWxlOiBzdHJpbmcpOiBzdHJpbmdcbntcblx0aWYgKGZpbGUuaW5kZXhPZignXCInKSA9PSAwIHx8IGZpbGUubWF0Y2goLyg/OlxcXFwoXFxkezN9KSkvKSlcblx0e1xuXHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoL15cInxcIiQvZywgJycpO1xuXG5cdFx0ZmlsZSA9IF9kZWNvZGUoZmlsZSk7XG5cdH1cblxuXHRyZXR1cm4gZmlsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY2FtZWxpemUoa2V5OiBzdHJpbmcpOiBzdHJpbmdcbntcblx0cmV0dXJuIF9kZWNhbWVsaXplKGtleSwgJy0nKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9GbGFnKGtleTogc3RyaW5nKVxue1xuXHRyZXR1cm4gJy0tJyArIGRlY2FtZWxpemUoa2V5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZsYWdzQm9vbChjb21tYW5kczogSUNvbW1hbmRzLCBvcHRpb25zOiBJT3B0aW9ucywgZmxhZ05hbWVzOiBzdHJpbmdbXSlcbntcblx0Zm9yIChsZXQgayBvZiBmbGFnTmFtZXMpXG5cdHtcblx0XHRpZiAob3B0aW9uc1trXSlcblx0XHR7XG5cdFx0XHRjb21tYW5kcy5wdXNoKHRvRmxhZyhrKSlcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gY29tbWFuZHNcbn1cblxuLyoqKlxuIEFkZCBvcHRpb25hbCBwYXJhbWV0ZXIgdG8gY29tbWFuZFxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkT3B0aW9uYWwoY29tbWFuZHM6IElDb21tYW5kcywgb3B0aW9uczogSU9wdGlvbnMpXG57XG5cdGxldCBjbWRPcHRpb25hbCA9IFsnYXV0aG9yJywgJ3NpbmNlJywgJ2FmdGVyJywgJ3VudGlsJywgJ2JlZm9yZScsICdjb21taXR0ZXInXVxuXHRmb3IgKGxldCBrIG9mIGNtZE9wdGlvbmFsKVxuXHR7XG5cdFx0aWYgKG9wdGlvbnNba10pXG5cdFx0e1xuXHRcdFx0Y29tbWFuZHMucHVzaChgLS0ke2t9PSR7b3B0aW9uc1trXX1gKVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gY29tbWFuZHNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ29tbWl0RmllbGRzKHBhcnNlZDogSVBhcnNlQ29tbWl0LCBjb21taXRGaWVsZDogc3RyaW5nLCBpbmRleDogbnVtYmVyLCBmaWVsZHM6IElGaWVsZHNBcnJheSlcbntcblx0bGV0IGtleSA9IGZpZWxkc1tpbmRleF07XG5cblx0c3dpdGNoIChrZXkpXG5cdHtcblx0XHRjYXNlICd0YWdzJzpcblx0XHRcdGxldCB0YWdzID0gW107XG5cdFx0XHRsZXQgc3RhcnQgPSBjb21taXRGaWVsZC5pbmRleE9mKCd0YWc6ICcpO1xuXHRcdFx0aWYgKHN0YXJ0ID49IDApXG5cdFx0XHR7XG5cdFx0XHRcdGNvbW1pdEZpZWxkXG5cdFx0XHRcdFx0LnN1YnN0cihzdGFydCArIDUpXG5cdFx0XHRcdFx0LnRyaW0oKVxuXHRcdFx0XHRcdC5zcGxpdCgnLCcpXG5cdFx0XHRcdFx0LmZvckVhY2goZnVuY3Rpb24gKHRhZylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0YWdzLnB1c2godGFnLnRyaW0oKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0O1xuXHRcdFx0fVxuXHRcdFx0cGFyc2VkW2tleV0gPSB0YWdzO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnYXV0aG9yRGF0ZVVuaXhUaW1lc3RhbXAnOlxuXHRcdGNhc2UgJ2NvbW1pdHRlckRhdGVVbml4VGltZXN0YW1wJzpcblx0XHRcdHBhcnNlZFtrZXldID0gcGFyc2VJbnQoY29tbWl0RmllbGQpO1xuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHBhcnNlZFtrZXldID0gY29tbWl0RmllbGQ7XG5cdFx0XHRicmVhaztcblx0fVxuXG5cdHJldHVybiBwYXJzZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUNvbW1pdHMoY29tbWl0czogc3RyaW5nW10sIG9wdGlvbnM6IElPcHRpb25zKTogSVJldHVybkNvbW1pdHNcbntcblx0bGV0IHsgZmllbGRzLCBuYW1lU3RhdHVzIH0gPSBvcHRpb25zO1xuXG5cdHJldHVybiBjb21taXRzLm1hcChmdW5jdGlvbiAoX2NvbW1pdCwgX2luZGV4KVxuXHR7XG5cdFx0bGV0IHBhcnRzID0gX2NvbW1pdC5zcGxpdChFbnVtUHJldHR5Rm9ybWF0TWFyay5FTkQpO1xuXG5cdFx0bGV0IGNvbW1pdCA9IHBhcnRzWzBdLnNwbGl0KGRlbGltaXRlcik7XG5cblx0XHRsZXQgbmFtZVN0YXR1c0ZpbGVzOiBJUGFyc2VDb21taXRbXCJmaWxlU3RhdHVzXCJdID0gW107XG5cblx0XHRpZiAocGFydHNbMV0pXG5cdFx0e1xuXHRcdFx0bGV0IHBhcnNlTmFtZVN0YXR1cyA9IHBhcnRzWzFdLnRyaW1MZWZ0KCkuc3BsaXQoTEYpO1xuXG5cdFx0XHQvLyBSZW1vdmVzIGxhc3QgZW1wdHkgY2hhciBpZiBleGlzdHNcblx0XHRcdGlmIChwYXJzZU5hbWVTdGF0dXNbcGFyc2VOYW1lU3RhdHVzLmxlbmd0aCAtIDFdID09PSAnJylcblx0XHRcdHtcblx0XHRcdFx0cGFyc2VOYW1lU3RhdHVzLnBvcCgpXG5cdFx0XHR9XG5cblx0XHRcdHBhcnNlTmFtZVN0YXR1cyA9IHBhcnNlTmFtZVN0YXR1c1xuXHRcdFx0Ly8gU3BsaXQgZWFjaCBsaW5lIGludG8gaXQncyBvd24gZGVsaW1pdGVyZWQgYXJyYXlcblx0XHRcdFx0Lm1hcChmdW5jdGlvbiAoZCwgaSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBkLnNwbGl0KGRlbGltaXRlcik7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC8vIDAgd2lsbCBhbHdheXMgYmUgc3RhdHVzLCBsYXN0IHdpbGwgYmUgdGhlIGZpbGVuYW1lIGFzIGl0IGlzIGluIHRoZSBjb21taXQsXG5cdFx0XHRcdC8vIGFueXRoaW5nIGluYmV0d2VlbiBjb3VsZCBiZSB0aGUgb2xkIG5hbWUgaWYgcmVuYW1lZCBvciBjb3BpZWRcblx0XHRcdFx0LnJlZHVjZShmdW5jdGlvbiAoYSwgYilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxldCB0ZW1wQXJyOiBbRW51bUZpbGVTdGF0dXMsIHN0cmluZ10gPSBbYlswXSBhcyBFbnVtRmlsZVN0YXR1cywgYltiLmxlbmd0aCAtIDFdXTtcblxuXHRcdFx0XHRcdHRlbXBBcnJbMV0gPSBkZWNvZGUodGVtcEFyclsxXSk7XG5cblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0bmFtZVN0YXR1c0ZpbGVzLnB1c2godGVtcEFycik7XG5cblx0XHRcdFx0XHQvLyBJZiBhbnkgZmlsZXMgaW4gYmV0d2VlbiBsb29wIHRocm91Z2ggdGhlbVxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAxLCBsZW4gPSBiLmxlbmd0aCAtIDE7IGkgPCBsZW47IGkrKylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQvLyBJZiBzdGF0dXMgUiB0aGVuIGFkZCB0aGUgb2xkIGZpbGVuYW1lIGFzIGEgZGVsZXRlZCBmaWxlICsgc3RhdHVzXG5cdFx0XHRcdFx0XHQvLyBPdGhlciBwb3RlbnRpYWxzIGFyZSBDIGZvciBjb3BpZWQgYnV0IHRoaXMgd291bGRuJ3QgcmVxdWlyZSB0aGUgb3JpZ2luYWwgZGVsZXRpbmdcblx0XHRcdFx0XHRcdGlmIChiWzBdLnNsaWNlKDAsIDEpID09PSBFbnVtRmlsZVN0YXR1cy5SRU5BTUVEKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR0ZW1wQXJyLnB1c2goRW51bUZpbGVTdGF0dXMuREVMRVRFRCwgYltpXSk7XG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0bmFtZVN0YXR1c0ZpbGVzLnB1c2goW0VudW1GaWxlU3RhdHVzLkRFTEVURUQsIGRlY29kZShiW2ldKV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBhLmNvbmNhdCh0ZW1wQXJyKTtcblx0XHRcdFx0fSwgW10pXG5cdFx0XHQ7XG5cblx0XHRcdGNvbW1pdCA9IGNvbW1pdC5jb25jYXQocGFyc2VOYW1lU3RhdHVzKVxuXHRcdH1cblxuXHRcdGRlYnVnKCdjb21taXQnLCBjb21taXQpO1xuXG5cdFx0Ly8gUmVtb3ZlIHRoZSBmaXJzdCBlbXB0eSBjaGFyIGZyb20gdGhlIGFycmF5XG5cdFx0Y29tbWl0LnNoaWZ0KCk7XG5cblx0XHRsZXQgcGFyc2VkOiBJUGFyc2VDb21taXQgPSB7XG5cdFx0XHRfaW5kZXgsXG5cdFx0fTtcblxuXHRcdGlmIChuYW1lU3RhdHVzKVxuXHRcdHtcblx0XHRcdC8vIENyZWF0ZSBhcnJheXMgZm9yIG5vbiBvcHRpb25hbCBmaWVsZHMgaWYgdHVybmVkIG9uXG5cdFx0XHRub3RPcHRGaWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoZClcblx0XHRcdHtcblx0XHRcdFx0cGFyc2VkW2RdID0gW107XG5cdFx0XHR9KVxuXHRcdH1cblxuXHRcdGNvbW1pdC5mb3JFYWNoKGZ1bmN0aW9uIChjb21taXRGaWVsZCwgaW5kZXgpXG5cdFx0e1xuXHRcdFx0aWYgKGZpZWxkc1tpbmRleF0pXG5cdFx0XHR7XG5cdFx0XHRcdHBhcnNlZCA9IHBhcnNlQ29tbWl0RmllbGRzKHBhcnNlZCwgY29tbWl0RmllbGQsIGluZGV4LCBmaWVsZHMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAobmFtZVN0YXR1cylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxldCBwb3MgPSAoaW5kZXggLSBmaWVsZHMubGVuZ3RoKSAlIG5vdE9wdEZpZWxkcy5sZW5ndGg7XG5cblx0XHRcdFx0XHRkZWJ1ZygnbmFtZVN0YXR1cycsIChpbmRleCAtIGZpZWxkcy5sZW5ndGgpLCBub3RPcHRGaWVsZHMubGVuZ3RoLCBwb3MsIGNvbW1pdEZpZWxkKTtcblx0XHRcdFx0XHRwYXJzZWRbbm90T3B0RmllbGRzW3Bvc11dLnB1c2goY29tbWl0RmllbGQpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChuYW1lU3RhdHVzICYmIG9wdGlvbnMubmFtZVN0YXR1c0ZpbGVzKVxuXHRcdHtcblx0XHRcdHBhcnNlZC5maWxlU3RhdHVzID0gYXJyYXlfdW5pcXVlKG5hbWVTdGF0dXNGaWxlcykgYXMgdHlwZW9mIG5hbWVTdGF0dXNGaWxlcztcblx0XHR9XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0cGFyc2VkID0gc29ydE9iamVjdEtleXMocGFyc2VkLCBLRVlfT1JERVIpO1xuXG5cdFx0cmV0dXJuIHBhcnNlZFxuXHR9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDb21taXRzU3Rkb3V0KG9wdGlvbnM6IElPcHRpb25zLCBzdGRvdXQ6IEJ1ZmZlcik6IElSZXR1cm5Db21taXRzXG57XG5cdGxldCBzdHI6IHN0cmluZztcblxuXHRkZWJ1Zygnc3Rkb3V0Jywgc3Rkb3V0KTtcblxuXHRpZiAob3B0aW9ucy5mbkhhbmRsZUJ1ZmZlcilcblx0e1xuXHRcdHN0ciA9IG9wdGlvbnMuZm5IYW5kbGVCdWZmZXIoc3Rkb3V0KVxuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdHN0ciA9IHN0ZG91dC50b1N0cmluZygpXG5cdH1cblxuXHQvL2NvbnNvbGUubG9nKHN0cik7XG5cblx0bGV0IGNvbW1pdHM6IHVua25vd25bXSA9IHN0ci5zcGxpdChFbnVtUHJldHR5Rm9ybWF0TWFyay5CRUdJTik7XG5cdGlmIChjb21taXRzWzBdID09PSAnJylcblx0e1xuXHRcdGNvbW1pdHMuc2hpZnQoKVxuXHR9XG5cdGRlYnVnKCdjb21taXRzJywgY29tbWl0cyk7XG5cblx0Y29tbWl0cyA9IHBhcnNlQ29tbWl0cyhjb21taXRzIGFzIHN0cmluZ1tdLCBvcHRpb25zKTtcblxuXHRkZWJ1ZygnY29tbWl0czpwYXJzZWQnLCBjb21taXRzKTtcblxuXHRyZXR1cm4gY29tbWl0cyBhcyBJUmV0dXJuQ29tbWl0cztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQXN5bmNDYWxsYmFjazxFID0gUmV0dXJuVHlwZTx0eXBlb2YgY3JlYXRlRXJyb3I+Plxue1xuXHQoZXJyb3I6IEUsIGNvbW1pdHM6IElSZXR1cm5Db21taXRzKTogdm9pZCxcblx0KGVycm9yOiBuZXZlciwgY29tbWl0czogSVJldHVybkNvbW1pdHMpOiB2b2lkLFxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRXJyb3I8RCBleHRlbmRzIGFueSwgRSBleHRlbmRzIEVycm9yPihtZXNzYWdlPywgZGF0YT86IEQsIGVycj86IHtcblx0bmV3ICgpOiBFLFxuXHRuZXcgKC4uLmFyZ3YpOiBFLFxufSk6IEUgJiB7XG5cdGRhdGE6IEQsXG59XG57XG5cdC8vIEB0cy1pZ25vcmVcblx0ZXJyID0gZXJyIHx8IEVycm9yO1xuXG5cdGxldCBlID0gbWVzc2FnZSBpbnN0YW5jZW9mIEVycm9yID8gbWVzc2FnZSA6IG5ldyBlcnIobWVzc2FnZSk7XG5cblx0Ly8gQHRzLWlnbm9yZVxuXHRlLmRhdGEgPSBkYXRhO1xuXG5cdC8vIEB0cy1pZ25vcmVcblx0cmV0dXJuIGU7XG59XG5cbi8vIEB0cy1pZ25vcmVcbk9iamVjdC5mcmVlemUoZXhwb3J0cyk7XG4iXX0=