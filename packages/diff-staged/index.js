"use strict";
/**
 * Created by user on 2019/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const git_1 = require("@git-lazy/util/spawn/git");
const glob_sort_1 = require("node-novel-globby/lib/glob-sort");
const array_hyper_unique_1 = require("array-hyper-unique");
function gitDiffStaged(git_root, options) {
    git_root = validGitRoot(git_root);
    const { bin = 'git' } = (options || {});
    let cp = git_1.crossSpawnSync(bin, 'diff --cached --name-only'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    return _handle(cp.stdout.toString());
}
exports.gitDiffStaged = gitDiffStaged;
function gitDiffStagedDir(git_root, options) {
    git_root = validGitRoot(git_root);
    const { bin = 'git' } = (options || {});
    let cp = git_1.crossSpawnSync(bin, 'diff --cached --dirstat=files,0'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    let cp2 = git_1.crossSpawnSync(bin, 'diff --dirstat=files,0'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    return _handle([
        cp.stdout.toString(),
        cp2.stdout.toString(),
    ].join('\n'), s => {
        return s.replace(/^\s+\d+(\.\d+)%\s+/, '');
    });
}
exports.gitDiffStagedDir = gitDiffStagedDir;
function gitDiffStagedFile(git_root, options) {
    git_root = validGitRoot(git_root);
    const { bin = 'git' } = (options || {});
    let cp = git_1.crossSpawnSync(bin, 'diff --cached --name-only --relative'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    let cp2 = git_1.crossSpawnSync(bin, 'diff --name-only --relative'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    return _handle([
        cp.stdout.toString(),
        cp2.stdout.toString(),
    ].join('\n'));
}
exports.gitDiffStagedFile = gitDiffStagedFile;
function _handle(output, trimFn) {
    trimFn = trimFn || (s => s);
    return glob_sort_1.sortTree(array_hyper_unique_1.array_unique(output
        .split(/[\n\r]+/)
        .map(s => trimFn(s).trim())
        .filter(_filterEmpty)));
}
function _filterEmpty(v) {
    return v != null && v !== '';
}
function validGitRoot(git_root) {
    if (!git_root) {
        throw new TypeError(`'${git_root}' is not a valid git root`);
    }
    return git_root;
}
exports.default = gitDiffStagedFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsa0RBQXlHO0FBQ3pHLCtEQUEyRDtBQUMzRCwyREFBK0Q7QUFPL0QsU0FBZ0IsYUFBYSxDQUFDLFFBQWdCLEVBQUUsT0FBa0I7SUFFakUsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVsQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFHLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRXhDLElBQUksRUFBRSxHQUFHLG9CQUFjLENBQUMsR0FBRyxFQUFFLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNwRSxHQUFHLEVBQUUsUUFBUTtRQUNiLFNBQVMsRUFBRSxJQUFJO0tBQ2YsQ0FBQyxDQUFDO0lBRUgsT0FBTyxPQUFPLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFaRCxzQ0FZQztBQUVELFNBQWdCLGdCQUFnQixDQUFDLFFBQWdCLEVBQUUsT0FBa0I7SUFFcEUsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVsQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFHLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRXhDLElBQUksRUFBRSxHQUFHLG9CQUFjLENBQUMsR0FBRyxFQUMxQixpQ0FBaUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQzVDO1FBQ0MsR0FBRyxFQUFFLFFBQVE7UUFDYixTQUFTLEVBQUUsSUFBSTtLQUNmLENBQ0QsQ0FBQztJQUVGLElBQUksR0FBRyxHQUFHLG9CQUFjLENBQUMsR0FBRyxFQUMzQix3QkFBd0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQ25DO1FBQ0MsR0FBRyxFQUFFLFFBQVE7UUFDYixTQUFTLEVBQUUsSUFBSTtLQUNmLENBQ0QsQ0FBQztJQUVGLE9BQU8sT0FBTyxDQUFDO1FBQ2QsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDcEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7S0FDckIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7UUFFakIsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBQzNDLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQTdCRCw0Q0E2QkM7QUFFRCxTQUFnQixpQkFBaUIsQ0FBQyxRQUFnQixFQUFFLE9BQWtCO0lBRXJFLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFbEMsTUFBTSxFQUFFLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBRyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztJQUV4QyxJQUFJLEVBQUUsR0FBRyxvQkFBYyxDQUFDLEdBQUcsRUFDMUIsc0NBQXNDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUNqRDtRQUNDLEdBQUcsRUFBRSxRQUFRO1FBQ2IsU0FBUyxFQUFFLElBQUk7S0FDZixDQUNELENBQUM7SUFFRixJQUFJLEdBQUcsR0FBRyxvQkFBYyxDQUFDLEdBQUcsRUFDM0IsNkJBQTZCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUN4QztRQUNDLEdBQUcsRUFBRSxRQUFRO1FBQ2IsU0FBUyxFQUFFLElBQUk7S0FDZixDQUNELENBQUM7SUFFRixPQUFPLE9BQU8sQ0FBQztRQUNkLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1FBQ3BCLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO0tBQ3JCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDZixDQUFDO0FBMUJELDhDQTBCQztBQUVELFNBQVMsT0FBTyxDQUFDLE1BQWMsRUFBRSxNQUFpQztJQUVqRSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU1QixPQUFPLG9CQUFRLENBQUMsaUNBQVksQ0FBQyxNQUFNO1NBQ2pDLEtBQUssQ0FBQyxTQUFTLENBQUM7U0FDaEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzFCLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQ3RCO0FBQ0gsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLENBQVM7SUFFOUIsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDN0IsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLFFBQWdCO0lBRXJDLElBQUksQ0FBQyxRQUFRLEVBQ2I7UUFDQyxNQUFNLElBQUksU0FBUyxDQUFDLElBQUksUUFBUSwyQkFBMkIsQ0FBQyxDQUFDO0tBQzdEO0lBRUQsT0FBTyxRQUFRLENBQUE7QUFDaEIsQ0FBQztBQUVELGtCQUFlLGlCQUFpQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOS82LzEzLlxuICovXG5cbmltcG9ydCB7IGNyb3NzU3Bhd25TeW5jLCBjcm9zc1NwYXduQXN5bmMsIFNwYXduT3B0aW9ucywgY2hlY2tHaXRPdXRwdXQgfSBmcm9tICdAZ2l0LWxhenkvdXRpbC9zcGF3bi9naXQnO1xuaW1wb3J0IHsgc29ydFRyZWUgfSBmcm9tICdub2RlLW5vdmVsLWdsb2JieS9saWIvZ2xvYi1zb3J0JztcbmltcG9ydCB7IGFycmF5X3VuaXF1ZSwgbGF6eV91bmlxdWUgfSBmcm9tICdhcnJheS1oeXBlci11bmlxdWUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElPcHRpb25zXG57XG5cdGJpbj86IHN0cmluZ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2l0RGlmZlN0YWdlZChnaXRfcm9vdDogc3RyaW5nLCBvcHRpb25zPzogSU9wdGlvbnMpOiBzdHJpbmdbXVxue1xuXHRnaXRfcm9vdCA9IHZhbGlkR2l0Um9vdChnaXRfcm9vdCk7XG5cblx0Y29uc3QgeyBiaW4gPSAnZ2l0JyB9ID0gKG9wdGlvbnMgfHwge30pO1xuXG5cdGxldCBjcCA9IGNyb3NzU3Bhd25TeW5jKGJpbiwgJ2RpZmYgLS1jYWNoZWQgLS1uYW1lLW9ubHknLnNwbGl0KCcgJyksIHtcblx0XHRjd2Q6IGdpdF9yb290LFxuXHRcdHN0cmlwQW5zaTogdHJ1ZSxcblx0fSk7XG5cblx0cmV0dXJuIF9oYW5kbGUoY3Auc3Rkb3V0LnRvU3RyaW5nKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2l0RGlmZlN0YWdlZERpcihnaXRfcm9vdDogc3RyaW5nLCBvcHRpb25zPzogSU9wdGlvbnMpOiBzdHJpbmdbXVxue1xuXHRnaXRfcm9vdCA9IHZhbGlkR2l0Um9vdChnaXRfcm9vdCk7XG5cblx0Y29uc3QgeyBiaW4gPSAnZ2l0JyB9ID0gKG9wdGlvbnMgfHwge30pO1xuXG5cdGxldCBjcCA9IGNyb3NzU3Bhd25TeW5jKGJpbixcblx0XHQnZGlmZiAtLWNhY2hlZCAtLWRpcnN0YXQ9ZmlsZXMsMCcuc3BsaXQoJyAnKSxcblx0XHR7XG5cdFx0XHRjd2Q6IGdpdF9yb290LFxuXHRcdFx0c3RyaXBBbnNpOiB0cnVlLFxuXHRcdH0sXG5cdCk7XG5cblx0bGV0IGNwMiA9IGNyb3NzU3Bhd25TeW5jKGJpbixcblx0XHQnZGlmZiAtLWRpcnN0YXQ9ZmlsZXMsMCcuc3BsaXQoJyAnKSxcblx0XHR7XG5cdFx0XHRjd2Q6IGdpdF9yb290LFxuXHRcdFx0c3RyaXBBbnNpOiB0cnVlLFxuXHRcdH0sXG5cdCk7XG5cblx0cmV0dXJuIF9oYW5kbGUoW1xuXHRcdGNwLnN0ZG91dC50b1N0cmluZygpLFxuXHRcdGNwMi5zdGRvdXQudG9TdHJpbmcoKSxcblx0XS5qb2luKCdcXG4nKSwgcyA9PlxuXHR7XG5cdFx0cmV0dXJuIHMucmVwbGFjZSgvXlxccytcXGQrKFxcLlxcZCspJVxccysvLCAnJylcblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnaXREaWZmU3RhZ2VkRmlsZShnaXRfcm9vdDogc3RyaW5nLCBvcHRpb25zPzogSU9wdGlvbnMpOiBzdHJpbmdbXVxue1xuXHRnaXRfcm9vdCA9IHZhbGlkR2l0Um9vdChnaXRfcm9vdCk7XG5cblx0Y29uc3QgeyBiaW4gPSAnZ2l0JyB9ID0gKG9wdGlvbnMgfHwge30pO1xuXG5cdGxldCBjcCA9IGNyb3NzU3Bhd25TeW5jKGJpbixcblx0XHQnZGlmZiAtLWNhY2hlZCAtLW5hbWUtb25seSAtLXJlbGF0aXZlJy5zcGxpdCgnICcpLFxuXHRcdHtcblx0XHRcdGN3ZDogZ2l0X3Jvb3QsXG5cdFx0XHRzdHJpcEFuc2k6IHRydWUsXG5cdFx0fSxcblx0KTtcblxuXHRsZXQgY3AyID0gY3Jvc3NTcGF3blN5bmMoYmluLFxuXHRcdCdkaWZmIC0tbmFtZS1vbmx5IC0tcmVsYXRpdmUnLnNwbGl0KCcgJyksXG5cdFx0e1xuXHRcdFx0Y3dkOiBnaXRfcm9vdCxcblx0XHRcdHN0cmlwQW5zaTogdHJ1ZSxcblx0XHR9LFxuXHQpO1xuXG5cdHJldHVybiBfaGFuZGxlKFtcblx0XHRjcC5zdGRvdXQudG9TdHJpbmcoKSxcblx0XHRjcDIuc3Rkb3V0LnRvU3RyaW5nKCksXG5cdF0uam9pbignXFxuJykpO1xufVxuXG5mdW5jdGlvbiBfaGFuZGxlKG91dHB1dDogc3RyaW5nLCB0cmltRm4/OiAodGV4dDogc3RyaW5nKSA9PiBzdHJpbmcpOiBzdHJpbmdbXVxue1xuXHR0cmltRm4gPSB0cmltRm4gfHwgKHMgPT4gcyk7XG5cblx0cmV0dXJuIHNvcnRUcmVlKGFycmF5X3VuaXF1ZShvdXRwdXRcblx0XHQuc3BsaXQoL1tcXG5cXHJdKy8pXG5cdFx0Lm1hcChzID0+IHRyaW1GbihzKS50cmltKCkpXG5cdFx0LmZpbHRlcihfZmlsdGVyRW1wdHkpKSlcblx0XHQ7XG59XG5cbmZ1bmN0aW9uIF9maWx0ZXJFbXB0eSh2OiBzdHJpbmcpOiBib29sZWFuXG57XG5cdHJldHVybiB2ICE9IG51bGwgJiYgdiAhPT0gJydcbn1cblxuZnVuY3Rpb24gdmFsaWRHaXRSb290KGdpdF9yb290OiBzdHJpbmcpXG57XG5cdGlmICghZ2l0X3Jvb3QpXG5cdHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGAnJHtnaXRfcm9vdH0nIGlzIG5vdCBhIHZhbGlkIGdpdCByb290YCk7XG5cdH1cblxuXHRyZXR1cm4gZ2l0X3Jvb3Rcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2l0RGlmZlN0YWdlZEZpbGVcbiJdfQ==