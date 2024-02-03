"use strict";
/**
 * Created by user on 2019/1/6/006.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumPrettyFormatMark = exports.EnumPrettyFormatFlags = exports.notOptFields = exports.delimiter = exports.KEY_ORDER = exports.EnumGitDateFormat = exports.EnumFileStatus = exports.fields = exports.defaultOptions = exports.defaultFields = void 0;
exports.defaultFields = ['abbrevHash', 'hash', 'subject', 'authorName'];
exports.defaultOptions = {
    number: 10,
    fields: exports.defaultFields,
    nameStatus: true,
    findCopiesHarder: false,
    all: false,
};
/**
 * https://ruby-china.org/topics/939
 * https://git-scm.com/docs/pretty-formats
 */
exports.fields = {
    hash: '%H',
    abbrevHash: '%h',
    treeHash: '%T',
    abbrevTreeHash: '%t',
    parentHashes: '%P',
    abbrevParentHashes: '%P',
    authorName: '%an',
    authorEmail: '%ae',
    authorDate: '%ai',
    authorDateRel: '%ar',
    authorDateUnixTimestamp: '%at',
    committerName: '%cn',
    committerEmail: '%ce',
    committerDate: '%ci',
    committerDateRel: '%cr',
    committerDateUnixTimestamp: '%ct',
    subject: '%s',
    body: '%b',
    rawBody: '%B',
    tags: '%D',
    commitNotes: '%N',
    encoding: '%e',
    refNames: '%D',
};
/**
 * https://git-scm.com/docs/git-status
 */
var EnumFileStatus;
(function (EnumFileStatus) {
    /**
     * unmodified
     */
    EnumFileStatus["UNMODIFIED"] = " ";
    /**
     * modified
     */
    EnumFileStatus["MODIFIED"] = "M";
    /**
     * added
     */
    EnumFileStatus["ADDED"] = "A";
    /**
     * deleted
     */
    EnumFileStatus["DELETED"] = "D";
    /**
     * renamed
     */
    EnumFileStatus["RENAMED"] = "R";
    /**
     * copied
     */
    EnumFileStatus["COPIED"] = "C";
    /**
     * updated but unmerged
     */
    EnumFileStatus["UPDATED_BUT_UNMERGED"] = "U";
})(EnumFileStatus || (exports.EnumFileStatus = EnumFileStatus = {}));
/**
 * for moment
 */
var EnumGitDateFormat;
(function (EnumGitDateFormat) {
    /**
     * git style ISO 8601
     *
     * @example 2019-01-06 04:54:09 +0800
     */
    EnumGitDateFormat["ISO_8601"] = "YYYY-MM-DD HH:mm:ss Z";
    /**
     * git style RFC 2822
     */
    EnumGitDateFormat["RFC_2822"] = "ddd MMM DD HH:mm:ss YYYY ZZ";
    // old version
    EnumGitDateFormat["AUTHOR_DATE"] = "YYYY-MM-DD HH:mm:ss Z";
    EnumGitDateFormat["COMMITTER_DATE"] = "ddd MMM DD HH:mm:ss YYYY ZZ";
})(EnumGitDateFormat || (exports.EnumGitDateFormat = EnumGitDateFormat = {}));
exports.KEY_ORDER = [
    '_index',
    'hash',
    'abbrevHash',
    'treeHash',
    'abbrevTreeHash',
    'parentHashes',
    'abbrevParentHashes',
    'authorName',
    'authorEmail',
    'authorDate',
    'authorDateRel',
    'authorDateUnixTimestamp',
    'committerName',
    'committerEmail',
    'committerDate',
    'committerDateRel',
    'committerDateUnixTimestamp',
    'subject',
    'body',
    'rawBody',
    'tags',
    'refNames',
    'status',
    'files',
    'fileStatus',
];
exports.delimiter = "\t";
exports.notOptFields = ['status', 'files'];
var EnumPrettyFormatFlags;
(function (EnumPrettyFormatFlags) {
    EnumPrettyFormatFlags["PRETTY"] = "pretty";
    EnumPrettyFormatFlags["FORMAT"] = "format";
})(EnumPrettyFormatFlags || (exports.EnumPrettyFormatFlags = EnumPrettyFormatFlags = {}));
var EnumPrettyFormatMark;
(function (EnumPrettyFormatMark) {
    EnumPrettyFormatMark["BEGIN"] = "@begin@";
    EnumPrettyFormatMark["DELIMITER"] = "\t";
    EnumPrettyFormatMark["END"] = "@end@";
    EnumPrettyFormatMark["JOIN"] = "";
})(EnumPrettyFormatMark || (exports.EnumPrettyFormatMark = EnumPrettyFormatMark = {}));
//# sourceMappingURL=type.js.map