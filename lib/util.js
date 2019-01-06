"use strict";
/**
 * Created by user on 2019/1/6/006.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const array_hyper_unique_1 = require("array-hyper-unique");
const debug_1 = require("debug");
const fs_1 = require("fs");
const git_decode_1 = require("git-decode");
const type_1 = require("./type");
const extend = require("lodash.assign");
const sortObjectKeys = require("sort-object-keys2");
exports.debug = debug_1.default('gitlog');
function handleOptions(options) {
    // lazy name
    const REPO = typeof options.repo != 'undefined' ? options.repo : options.cwd;
    if (!REPO)
        throw new Error(`Repo required!, but got "${REPO}"`);
    if (!fs_1.existsSync(REPO))
        throw new Error(`Repo location does not exist: "${REPO}"`);
    let defaultExecOptions = { cwd: REPO };
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
    if (options.findCopiesHarder) {
        commands.push('--find-copies-harder');
    }
    if (options.all) {
        commands.push('--all');
    }
    if (options.number > 0) {
        commands.push('-n', options.number);
    }
    if (options.noMerges) {
        commands.push('--no-merges');
    }
    if (options.firstParent) {
        commands.push('--first-parent');
    }
    commands = addOptional(commands, options);
    {
        // Start of custom format
        // Iterating through the fields and adding them to the custom format
        let command = options.fields.reduce(function (command, field) {
            if (!type_1.fields[field] && type_1.notOptFields.indexOf(field) === -1)
                throw new Error('Unknown field: ' + field);
            command += type_1.delimiter + type_1.fields[field];
            return command;
        }, '--pretty=@begin@') + '@end@';
        commands.push(command);
    }
    // Append branch (revision range) if specified
    if (options.branch) {
        commands.push(options.branch);
    }
    if (options.file) {
        commands.push('--', options.file);
    }
    //File and file status
    if (options.nameStatus) {
        commands.push('--name-status');
    }
    exports.debug('command', options.execOptions, commands);
    return { bin, commands };
}
exports.buildCommands = buildCommands;
function decode(file) {
    if (file.indexOf('"') == 0 || file.match(/(?:\\(\d{3}))/)) {
        file = file.replace(/^"|"$/g, '');
        file = git_decode_1.decode(file);
    }
    return file;
}
exports.decode = decode;
/***
 Add optional parameter to command
 */
function addOptional(commands, options) {
    let cmdOptional = ['author', 'since', 'after', 'until', 'before', 'committer'];
    for (let i = cmdOptional.length; i--;) {
        if (options[cmdOptional[i]]) {
            commands.push(`--${cmdOptional[i]}="${options[cmdOptional[i]]}"`);
        }
    }
    return commands;
}
exports.addOptional = addOptional;
function parseCommits(commits, options) {
    let { fields, nameStatus } = options;
    return commits.map(function (_commit) {
        let parts = _commit.split('@end@');
        let commit = parts[0].split(type_1.delimiter);
        let nameStatusFiles = [];
        if (parts[1]) {
            let parseNameStatus = parts[1].trimLeft().split('\n');
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
                    if (b[0].slice(0, 1) === 'R') {
                        tempArr.push('D', b[i]);
                        // @ts-ignore
                        nameStatusFiles.push(['D', decode(b[i])]);
                    }
                }
                return a.concat(tempArr);
            }, []);
            commit = commit.concat(parseNameStatus);
        }
        exports.debug('commit', commit);
        // Remove the first empty char from the array
        commit.shift();
        let parsed = {};
        if (nameStatus) {
            // Create arrays for non optional fields if turned on
            type_1.notOptFields.forEach(function (d) {
                parsed[d] = [];
            });
        }
        commit.forEach(function (commitField, index) {
            if (fields[index]) {
                if (fields[index] === 'tags') {
                    let tags = [];
                    let start = commitField.indexOf('tag: ');
                    if (start >= 0) {
                        commitField.substr(start + 5).trim().split(',').forEach(function (tag) {
                            tags.push(tag.trim());
                        });
                    }
                    parsed[fields[index]] = tags;
                }
                else {
                    parsed[fields[index]] = commitField;
                }
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
    let commits = str.split('@begin@');
    if (commits[0] === '') {
        commits.shift();
    }
    exports.debug('commits', commits);
    commits = parseCommits(commits, options);
    exports.debug('commits:parsed', commits);
    return commits;
}
exports.parseCommitsStdout = parseCommitsStdout;
// @ts-ignore
Object.freeze(exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOztBQUVILDJEQUFrRDtBQUNsRCxpQ0FBMkI7QUFDM0IsMkJBQWdDO0FBQ2hDLDJDQUErQztBQUMvQyxpQ0FVZ0I7QUFDaEIsd0NBQXlDO0FBQ3pDLG9EQUFxRDtBQUV4QyxRQUFBLEtBQUssR0FBRyxlQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFdEMsU0FBZ0IsYUFBYSxDQUFDLE9BQWlCO0lBRTlDLFlBQVk7SUFDWixNQUFNLElBQUksR0FBRyxPQUFPLE9BQU8sQ0FBQyxJQUFJLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBRTdFLElBQUksQ0FBQyxJQUFJO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNoRSxJQUFJLENBQUMsZUFBVSxDQUFDLElBQUksQ0FBQztRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLElBQUksR0FBRyxDQUFDLENBQUM7SUFFbEYsSUFBSSxrQkFBa0IsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUV2QyxlQUFlO0lBQ2YsT0FBTyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUUscUJBQWMsRUFBRSxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25GLE9BQU8sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUV0RSxJQUFJLE9BQU8sQ0FBQyxlQUFlLEVBQzNCO1FBQ0MsT0FBTyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBTSxDQUFDLENBQUMsQ0FB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QVMsQ0FBbUIsQ0FBQztJQUNyRCxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQ3JCO1FBQ0MsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQ2Y7SUFDRCxhQUFLLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTFCLE9BQU8sR0FBRyxZQUFZLENBQUMsT0FBbUIsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVyRCxhQUFLLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFakMsT0FBTyxPQUFPLENBQUM7QUFDaEIsQ0FBQztBQTNCRCxnREEyQkM7QUFPRCxhQUFhO0FBQ2IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTkvMS82LzAwNi5cbiAqL1xuXG5pbXBvcnQgeyBhcnJheV91bmlxdWUgfSBmcm9tICdhcnJheS1oeXBlci11bmlxdWUnO1xuaW1wb3J0IGRlYnVnMCBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgeyBleGlzdHNTeW5jIH0gZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBkZWNvZGUgYXMgX2RlY29kZSB9IGZyb20gJ2dpdC1kZWNvZGUnO1xuaW1wb3J0IHtcblx0ZGVmYXVsdE9wdGlvbnMsXG5cdGRlbGltaXRlcixcblx0ZmllbGRzLFxuXHRJQ29tbWFuZHMsXG5cdElPcHRpb25zLFxuXHRJUGFyc2VDb21taXQsXG5cdElSZXR1cm5Db21taXRzLFxuXHRLRVlfT1JERVIsXG5cdG5vdE9wdEZpZWxkcyxcbn0gZnJvbSAnLi90eXBlJztcbmltcG9ydCBleHRlbmQgPSByZXF1aXJlKCdsb2Rhc2guYXNzaWduJyk7XG5pbXBvcnQgc29ydE9iamVjdEtleXMgPSByZXF1aXJlKCdzb3J0LW9iamVjdC1rZXlzMicpO1xuXG5leHBvcnQgY29uc3QgZGVidWcgPSBkZWJ1ZzAoJ2dpdGxvZycpO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlT3B0aW9ucyhvcHRpb25zOiBJT3B0aW9ucylcbntcblx0Ly8gbGF6eSBuYW1lXG5cdGNvbnN0IFJFUE8gPSB0eXBlb2Ygb3B0aW9ucy5yZXBvICE9ICd1bmRlZmluZWQnID8gb3B0aW9ucy5yZXBvIDogb3B0aW9ucy5jd2Q7XG5cblx0aWYgKCFSRVBPKSB0aHJvdyBuZXcgRXJyb3IoYFJlcG8gcmVxdWlyZWQhLCBidXQgZ290IFwiJHtSRVBPfVwiYCk7XG5cdGlmICghZXhpc3RzU3luYyhSRVBPKSkgdGhyb3cgbmV3IEVycm9yKGBSZXBvIGxvY2F0aW9uIGRvZXMgbm90IGV4aXN0OiBcIiR7UkVQT31cImApO1xuXG5cdGxldCBkZWZhdWx0RXhlY09wdGlvbnMgPSB7IGN3ZDogUkVQTyB9O1xuXG5cdC8vIFNldCBkZWZhdWx0c1xuXHRvcHRpb25zID0gZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgeyBleGVjT3B0aW9uczogZGVmYXVsdEV4ZWNPcHRpb25zIH0sIG9wdGlvbnMpO1xuXHRvcHRpb25zLmV4ZWNPcHRpb25zID0gZXh0ZW5kKG9wdGlvbnMuZXhlY09wdGlvbnMsIGRlZmF1bHRFeGVjT3B0aW9ucyk7XG5cblx0aWYgKG9wdGlvbnMucmV0dXJuQWxsRmllbGRzKVxuXHR7XG5cdFx0b3B0aW9ucy5maWVsZHMgPSBbXS5jb25jYXQoT2JqZWN0LmtleXMoZmllbGRzKSk7XG5cblx0XHRpZiAob3B0aW9ucy5uYW1lU3RhdHVzICYmIHR5cGVvZiBvcHRpb25zLm5hbWVTdGF0dXNGaWxlcyA9PSAndW5kZWZpbmVkJylcblx0XHR7XG5cdFx0XHRvcHRpb25zLm5hbWVTdGF0dXNGaWxlcyA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIG9wdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZENvbW1hbmRzKG9wdGlvbnM6IElPcHRpb25zKToge1xuXHRiaW46IHN0cmluZyxcblx0Y29tbWFuZHM6IElDb21tYW5kcyxcbn1cbntcblx0Ly8gU3RhcnQgY29uc3RydWN0aW5nIGNvbW1hbmRcblxuXHRsZXQgYmluID0gJ2dpdCc7XG5cdGxldCBjb21tYW5kczogSUNvbW1hbmRzID0gW1xuXHRcdCdsb2cnLFxuXHRdO1xuXG5cdGlmIChvcHRpb25zLmZpbmRDb3BpZXNIYXJkZXIpXG5cdHtcblx0XHRjb21tYW5kcy5wdXNoKCctLWZpbmQtY29waWVzLWhhcmRlcicpO1xuXHR9XG5cblx0aWYgKG9wdGlvbnMuYWxsKVxuXHR7XG5cdFx0Y29tbWFuZHMucHVzaCgnLS1hbGwnKTtcblx0fVxuXG5cdGlmIChvcHRpb25zLm51bWJlciA+IDApXG5cdHtcblx0XHRjb21tYW5kcy5wdXNoKCctbicsIG9wdGlvbnMubnVtYmVyKTtcblx0fVxuXG5cdGlmIChvcHRpb25zLm5vTWVyZ2VzKVxuXHR7XG5cdFx0Y29tbWFuZHMucHVzaCgnLS1uby1tZXJnZXMnKTtcblx0fVxuXG5cdGlmIChvcHRpb25zLmZpcnN0UGFyZW50KVxuXHR7XG5cdFx0Y29tbWFuZHMucHVzaCgnLS1maXJzdC1wYXJlbnQnKTtcblx0fVxuXG5cdGNvbW1hbmRzID0gYWRkT3B0aW9uYWwoY29tbWFuZHMsIG9wdGlvbnMpO1xuXG5cdHtcblx0XHQvLyBTdGFydCBvZiBjdXN0b20gZm9ybWF0XG5cdFx0Ly8gSXRlcmF0aW5nIHRocm91Z2ggdGhlIGZpZWxkcyBhbmQgYWRkaW5nIHRoZW0gdG8gdGhlIGN1c3RvbSBmb3JtYXRcblx0XHRsZXQgY29tbWFuZCA9IG9wdGlvbnMuZmllbGRzLnJlZHVjZShmdW5jdGlvbiAoY29tbWFuZCwgZmllbGQpXG5cdFx0e1xuXHRcdFx0aWYgKCFmaWVsZHNbZmllbGRdICYmIG5vdE9wdEZpZWxkcy5pbmRleE9mKGZpZWxkKSA9PT0gLTEpIHRocm93IG5ldyBFcnJvcignVW5rbm93biBmaWVsZDogJyArIGZpZWxkKVxuXHRcdFx0Y29tbWFuZCArPSBkZWxpbWl0ZXIgKyBmaWVsZHNbZmllbGRdXG5cblx0XHRcdHJldHVybiBjb21tYW5kO1xuXHRcdH0sICctLXByZXR0eT1AYmVnaW5AJykgKyAnQGVuZEAnO1xuXG5cdFx0Y29tbWFuZHMucHVzaChjb21tYW5kKTtcblx0fVxuXG5cdC8vIEFwcGVuZCBicmFuY2ggKHJldmlzaW9uIHJhbmdlKSBpZiBzcGVjaWZpZWRcblx0aWYgKG9wdGlvbnMuYnJhbmNoKVxuXHR7XG5cdFx0Y29tbWFuZHMucHVzaChvcHRpb25zLmJyYW5jaCk7XG5cdH1cblxuXHRpZiAob3B0aW9ucy5maWxlKVxuXHR7XG5cdFx0Y29tbWFuZHMucHVzaCgnLS0nLCBvcHRpb25zLmZpbGUpO1xuXHR9XG5cblx0Ly9GaWxlIGFuZCBmaWxlIHN0YXR1c1xuXHRpZiAob3B0aW9ucy5uYW1lU3RhdHVzKVxuXHR7XG5cdFx0Y29tbWFuZHMucHVzaCgnLS1uYW1lLXN0YXR1cycpO1xuXHR9XG5cblx0ZGVidWcoJ2NvbW1hbmQnLCBvcHRpb25zLmV4ZWNPcHRpb25zLCBjb21tYW5kcyk7XG5cblx0cmV0dXJuIHsgYmluLCBjb21tYW5kcyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNvZGUoZmlsZTogc3RyaW5nKTogc3RyaW5nXG57XG5cdGlmIChmaWxlLmluZGV4T2YoJ1wiJykgPT0gMCB8fCBmaWxlLm1hdGNoKC8oPzpcXFxcKFxcZHszfSkpLykpXG5cdHtcblx0XHRmaWxlID0gZmlsZS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKTtcblxuXHRcdGZpbGUgPSBfZGVjb2RlKGZpbGUpO1xuXHR9XG5cblx0cmV0dXJuIGZpbGU7XG59XG5cbi8qKipcbiBBZGQgb3B0aW9uYWwgcGFyYW1ldGVyIHRvIGNvbW1hbmRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZE9wdGlvbmFsKGNvbW1hbmRzOiBJQ29tbWFuZHMsIG9wdGlvbnM6IElPcHRpb25zKVxue1xuXHRsZXQgY21kT3B0aW9uYWwgPSBbJ2F1dGhvcicsICdzaW5jZScsICdhZnRlcicsICd1bnRpbCcsICdiZWZvcmUnLCAnY29tbWl0dGVyJ11cblx0Zm9yIChsZXQgaSA9IGNtZE9wdGlvbmFsLmxlbmd0aDsgaS0tOylcblx0e1xuXHRcdGlmIChvcHRpb25zW2NtZE9wdGlvbmFsW2ldXSlcblx0XHR7XG5cdFx0XHRjb21tYW5kcy5wdXNoKGAtLSR7Y21kT3B0aW9uYWxbaV19PVwiJHtvcHRpb25zW2NtZE9wdGlvbmFsW2ldXX1cImApXG5cdFx0fVxuXHR9XG5cdHJldHVybiBjb21tYW5kc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDb21taXRzKGNvbW1pdHM6IHN0cmluZ1tdLCBvcHRpb25zOiBJT3B0aW9ucyk6IElSZXR1cm5Db21taXRzXG57XG5cdGxldCB7IGZpZWxkcywgbmFtZVN0YXR1cyB9ID0gb3B0aW9ucztcblxuXHRyZXR1cm4gY29tbWl0cy5tYXAoZnVuY3Rpb24gKF9jb21taXQpXG5cdHtcblx0XHRsZXQgcGFydHMgPSBfY29tbWl0LnNwbGl0KCdAZW5kQCcpXG5cblx0XHRsZXQgY29tbWl0ID0gcGFydHNbMF0uc3BsaXQoZGVsaW1pdGVyKTtcblxuXHRcdGxldCBuYW1lU3RhdHVzRmlsZXM6IFtzdHJpbmcsIHN0cmluZ11bXSA9IFtdO1xuXG5cdFx0aWYgKHBhcnRzWzFdKVxuXHRcdHtcblx0XHRcdGxldCBwYXJzZU5hbWVTdGF0dXMgPSBwYXJ0c1sxXS50cmltTGVmdCgpLnNwbGl0KCdcXG4nKTtcblxuXHRcdFx0Ly8gUmVtb3ZlcyBsYXN0IGVtcHR5IGNoYXIgaWYgZXhpc3RzXG5cdFx0XHRpZiAocGFyc2VOYW1lU3RhdHVzW3BhcnNlTmFtZVN0YXR1cy5sZW5ndGggLSAxXSA9PT0gJycpXG5cdFx0XHR7XG5cdFx0XHRcdHBhcnNlTmFtZVN0YXR1cy5wb3AoKVxuXHRcdFx0fVxuXG5cdFx0XHRwYXJzZU5hbWVTdGF0dXMgPSBwYXJzZU5hbWVTdGF0dXNcblx0XHRcdC8vIFNwbGl0IGVhY2ggbGluZSBpbnRvIGl0J3Mgb3duIGRlbGltaXRlcmVkIGFycmF5XG5cdFx0XHRcdC5tYXAoZnVuY3Rpb24gKGQsIGkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gZC5zcGxpdChkZWxpbWl0ZXIpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQvLyAwIHdpbGwgYWx3YXlzIGJlIHN0YXR1cywgbGFzdCB3aWxsIGJlIHRoZSBmaWxlbmFtZSBhcyBpdCBpcyBpbiB0aGUgY29tbWl0LFxuXHRcdFx0XHQvLyBhbnl0aGluZyBpbmJldHdlZW4gY291bGQgYmUgdGhlIG9sZCBuYW1lIGlmIHJlbmFtZWQgb3IgY29waWVkXG5cdFx0XHRcdC5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgdGVtcEFyciA9IFtiWzBdLCBiW2IubGVuZ3RoIC0gMV1dO1xuXG5cdFx0XHRcdFx0dGVtcEFyclsxXSA9IGRlY29kZSh0ZW1wQXJyWzFdKTtcblxuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRuYW1lU3RhdHVzRmlsZXMucHVzaCh0ZW1wQXJyKTtcblxuXHRcdFx0XHRcdC8vIElmIGFueSBmaWxlcyBpbiBiZXR3ZWVuIGxvb3AgdGhyb3VnaCB0aGVtXG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDEsIGxlbiA9IGIubGVuZ3RoIC0gMTsgaSA8IGxlbjsgaSsrKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8vIElmIHN0YXR1cyBSIHRoZW4gYWRkIHRoZSBvbGQgZmlsZW5hbWUgYXMgYSBkZWxldGVkIGZpbGUgKyBzdGF0dXNcblx0XHRcdFx0XHRcdC8vIE90aGVyIHBvdGVudGlhbHMgYXJlIEMgZm9yIGNvcGllZCBidXQgdGhpcyB3b3VsZG4ndCByZXF1aXJlIHRoZSBvcmlnaW5hbCBkZWxldGluZ1xuXHRcdFx0XHRcdFx0aWYgKGJbMF0uc2xpY2UoMCwgMSkgPT09ICdSJylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dGVtcEFyci5wdXNoKCdEJywgYltpXSk7XG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0bmFtZVN0YXR1c0ZpbGVzLnB1c2goWydEJywgZGVjb2RlKGJbaV0pXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGEuY29uY2F0KHRlbXBBcnIpO1xuXHRcdFx0XHR9LCBbXSlcblx0XHRcdDtcblxuXHRcdFx0Y29tbWl0ID0gY29tbWl0LmNvbmNhdChwYXJzZU5hbWVTdGF0dXMpXG5cdFx0fVxuXG5cdFx0ZGVidWcoJ2NvbW1pdCcsIGNvbW1pdClcblxuXHRcdC8vIFJlbW92ZSB0aGUgZmlyc3QgZW1wdHkgY2hhciBmcm9tIHRoZSBhcnJheVxuXHRcdGNvbW1pdC5zaGlmdCgpXG5cblx0XHRsZXQgcGFyc2VkOiBJUGFyc2VDb21taXQgPSB7fVxuXG5cdFx0aWYgKG5hbWVTdGF0dXMpXG5cdFx0e1xuXHRcdFx0Ly8gQ3JlYXRlIGFycmF5cyBmb3Igbm9uIG9wdGlvbmFsIGZpZWxkcyBpZiB0dXJuZWQgb25cblx0XHRcdG5vdE9wdEZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChkKVxuXHRcdFx0e1xuXHRcdFx0XHRwYXJzZWRbZF0gPSBbXTtcblx0XHRcdH0pXG5cdFx0fVxuXG5cdFx0Y29tbWl0LmZvckVhY2goZnVuY3Rpb24gKGNvbW1pdEZpZWxkLCBpbmRleClcblx0XHR7XG5cdFx0XHRpZiAoZmllbGRzW2luZGV4XSlcblx0XHRcdHtcblx0XHRcdFx0aWYgKGZpZWxkc1tpbmRleF0gPT09ICd0YWdzJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxldCB0YWdzID0gW107XG5cdFx0XHRcdFx0bGV0IHN0YXJ0ID0gY29tbWl0RmllbGQuaW5kZXhPZigndGFnOiAnKTtcblx0XHRcdFx0XHRpZiAoc3RhcnQgPj0gMClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb21taXRGaWVsZC5zdWJzdHIoc3RhcnQgKyA1KS50cmltKCkuc3BsaXQoJywnKS5mb3JFYWNoKGZ1bmN0aW9uICh0YWcpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHRhZ3MucHVzaCh0YWcudHJpbSgpKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwYXJzZWRbZmllbGRzW2luZGV4XV0gPSB0YWdzO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHBhcnNlZFtmaWVsZHNbaW5kZXhdXSA9IGNvbW1pdEZpZWxkXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0aWYgKG5hbWVTdGF0dXMpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgcG9zID0gKGluZGV4IC0gZmllbGRzLmxlbmd0aCkgJSBub3RPcHRGaWVsZHMubGVuZ3RoXG5cblx0XHRcdFx0XHRkZWJ1ZygnbmFtZVN0YXR1cycsIChpbmRleCAtIGZpZWxkcy5sZW5ndGgpLCBub3RPcHRGaWVsZHMubGVuZ3RoLCBwb3MsIGNvbW1pdEZpZWxkKVxuXHRcdFx0XHRcdHBhcnNlZFtub3RPcHRGaWVsZHNbcG9zXV0ucHVzaChjb21taXRGaWVsZClcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHRpZiAobmFtZVN0YXR1cyAmJiBvcHRpb25zLm5hbWVTdGF0dXNGaWxlcylcblx0XHR7XG5cdFx0XHRwYXJzZWQuZmlsZVN0YXR1cyA9IGFycmF5X3VuaXF1ZShuYW1lU3RhdHVzRmlsZXMpIGFzIHR5cGVvZiBuYW1lU3RhdHVzRmlsZXM7XG5cdFx0fVxuXG5cdFx0cGFyc2VkID0gc29ydE9iamVjdEtleXMocGFyc2VkLCBLRVlfT1JERVIpO1xuXG5cdFx0cmV0dXJuIHBhcnNlZFxuXHR9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDb21taXRzU3Rkb3V0KG9wdGlvbnM6IElPcHRpb25zLCBzdGRvdXQ6IEJ1ZmZlcilcbntcblx0bGV0IHN0cjogc3RyaW5nO1xuXG5cdGRlYnVnKCdzdGRvdXQnLCBzdGRvdXQpO1xuXG5cdGlmIChvcHRpb25zLmZuSGFuZGxlQnVmZmVyKVxuXHR7XG5cdFx0c3RyID0gb3B0aW9ucy5mbkhhbmRsZUJ1ZmZlcihzdGRvdXQpXG5cdH1cblx0ZWxzZVxuXHR7XG5cdFx0c3RyID0gc3Rkb3V0LnRvU3RyaW5nKClcblx0fVxuXG5cdGxldCBjb21taXRzID0gc3RyLnNwbGl0KCdAYmVnaW5AJykgYXMgSVJldHVybkNvbW1pdHM7XG5cdGlmIChjb21taXRzWzBdID09PSAnJylcblx0e1xuXHRcdGNvbW1pdHMuc2hpZnQoKVxuXHR9XG5cdGRlYnVnKCdjb21taXRzJywgY29tbWl0cyk7XG5cblx0Y29tbWl0cyA9IHBhcnNlQ29tbWl0cyhjb21taXRzIGFzIHN0cmluZ1tdLCBvcHRpb25zKTtcblxuXHRkZWJ1ZygnY29tbWl0czpwYXJzZWQnLCBjb21taXRzKTtcblxuXHRyZXR1cm4gY29tbWl0cztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQXN5bmNDYWxsYmFja1xue1xuXHQoZXJyb3IsIGNvbW1pdHM6IElSZXR1cm5Db21taXRzKTogdm9pZFxufVxuXG4vLyBAdHMtaWdub3JlXG5PYmplY3QuZnJlZXplKGV4cG9ydHMpO1xuIl19