"use strict";
/**
 * Created by user on 2018/5/16/016.
 */
const path = require("upath2");
const crossSpawn = require("cross-spawn");
function gitRoot(cwd) {
    let p = crossSpawn.sync('git', [
        'rev-parse',
        '--show-toplevel',
    ], {
        cwd,
    }).stdout.toString().replace(/^[\n\r]+|[\n\r]+$/g, '');
    if (p) {
        return path.resolve(p);
    }
    return null;
}
// @ts-ignore
gitRoot.default = gitRoot.gitRoot = gitRoot;
// @ts-ignore
gitRoot.async = async function (cwd) {
    return gitRoot(cwd);
};
module.exports = gitRoot;
