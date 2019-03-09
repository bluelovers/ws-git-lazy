"use strict";
/**
 * Created by user on 2018/5/16/016.
 */
const path = require("upath2");
const fs = require("fs");
const crossSpawn = require("cross-spawn");
function gitRoot(cwd) {
    let p = (crossSpawn.sync('git', [
        'rev-parse',
        '--show-toplevel',
    ], {
        cwd,
    }).stdout || '').toString().replace(/^[\n\r]+|[\n\r]+$/g, '');
    if (p) {
        p = path.resolve(p);
        if (fs.existsSync(p)) {
            return p;
        }
    }
    return null;
}
(function (gitRoot) {
    function isGitRoot(target) {
        let root = gitRoot(target);
        return (root && path.resolve(root) === path.resolve(target));
    }
    gitRoot.isGitRoot = isGitRoot;
    function sync(cwd) {
        return gitRoot(cwd);
    }
    gitRoot.sync = sync;
    async function async(cwd) {
        return gitRoot(cwd);
    }
    gitRoot.async = async;
})(gitRoot || (gitRoot = {}));
gitRoot.default = gitRoot;
module.exports = gitRoot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7QUFFSCwrQkFBZ0M7QUFDaEMseUJBQTBCO0FBQzFCLDBDQUEyQztBQUUzQyxTQUFTLE9BQU8sQ0FBQyxHQUFZO0lBRTVCLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDL0IsV0FBVztRQUNYLGlCQUFpQjtLQUNqQixFQUFFO1FBQ0YsR0FBRztLQUNILENBQUMsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRTlELElBQUksQ0FBQyxFQUNMO1FBQ0MsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFcEIsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUNwQjtZQUNDLE9BQU8sQ0FBQyxDQUFDO1NBQ1Q7S0FDRDtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2IsQ0FBQztBQUVELFdBQVUsT0FBTztJQUVoQixTQUFnQixTQUFTLENBQUMsTUFBYztRQUV2QyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFM0IsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBTGUsaUJBQVMsWUFLeEIsQ0FBQTtJQUVELFNBQWdCLElBQUksQ0FBQyxHQUFZO1FBRWhDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFIZSxZQUFJLE9BR25CLENBQUE7SUFFTSxLQUFLLFVBQVUsS0FBSyxDQUFDLEdBQVk7UUFFdkMsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUhxQixhQUFLLFFBRzFCLENBQUE7QUFDRixDQUFDLEVBbEJTLE9BQU8sS0FBUCxPQUFPLFFBa0JoQjtBQUVELE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBRTFCLGlCQUFTLE9BQU8sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTgvNS8xNi8wMTYuXG4gKi9cblxuaW1wb3J0IHBhdGggPSByZXF1aXJlKCd1cGF0aDInKTtcbmltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5pbXBvcnQgY3Jvc3NTcGF3biA9IHJlcXVpcmUoJ2Nyb3NzLXNwYXduJyk7XG5cbmZ1bmN0aW9uIGdpdFJvb3QoY3dkPzogc3RyaW5nKTogc3RyaW5nXG57XG5cdGxldCBwID0gKGNyb3NzU3Bhd24uc3luYygnZ2l0JywgW1xuXHRcdCdyZXYtcGFyc2UnLFxuXHRcdCctLXNob3ctdG9wbGV2ZWwnLFxuXHRdLCB7XG5cdFx0Y3dkLFxuXHR9KS5zdGRvdXQgfHwgJycpLnRvU3RyaW5nKCkucmVwbGFjZSgvXltcXG5cXHJdK3xbXFxuXFxyXSskL2csICcnKTtcblxuXHRpZiAocClcblx0e1xuXHRcdHAgPSBwYXRoLnJlc29sdmUocCk7XG5cblx0XHRpZiAoZnMuZXhpc3RzU3luYyhwKSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gcDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcbn1cblxubmFtZXNwYWNlIGdpdFJvb3Rcbntcblx0ZXhwb3J0IGZ1bmN0aW9uIGlzR2l0Um9vdCh0YXJnZXQ6IHN0cmluZylcblx0e1xuXHRcdGxldCByb290ID0gZ2l0Um9vdCh0YXJnZXQpO1xuXG5cdFx0cmV0dXJuIChyb290ICYmIHBhdGgucmVzb2x2ZShyb290KSA9PT0gcGF0aC5yZXNvbHZlKHRhcmdldCkpO1xuXHR9XG5cblx0ZXhwb3J0IGZ1bmN0aW9uIHN5bmMoY3dkPzogc3RyaW5nKVxuXHR7XG5cdFx0cmV0dXJuIGdpdFJvb3QoY3dkKTtcblx0fVxuXG5cdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBhc3luYyhjd2Q/OiBzdHJpbmcpXG5cdHtcblx0XHRyZXR1cm4gZ2l0Um9vdChjd2QpO1xuXHR9XG59XG5cbmdpdFJvb3QuZGVmYXVsdCA9IGdpdFJvb3Q7XG5cbmV4cG9ydCA9IGdpdFJvb3RcbiJdfQ==