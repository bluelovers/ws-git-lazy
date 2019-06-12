"use strict";
/**
 * Created by user on 2019/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const git_1 = require("@git-lazy/util/spawn/git");
const data_1 = require("@git-lazy/util/spawn/data");
const root_1 = require("@git-lazy/root");
function gitDiffStaged(git_root, options) {
    git_root = root_1.hasGit(git_root);
    const { bin = 'git' } = (options || {});
    let cp = git_1.crossSpawnSync(bin, 'diff --cached --name-only'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    return data_1.handleSpawnOutputArray(cp.stdout.toString());
}
exports.gitDiffStaged = gitDiffStaged;
function gitDiffStagedDir(git_root, options) {
    git_root = root_1.hasGit(git_root);
    const { bin = 'git' } = (options || {});
    let cp = git_1.crossSpawnSync(bin, 'diff --cached --dirstat=files,0'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    let cp2 = git_1.crossSpawnSync(bin, 'diff --dirstat=files,0'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    return data_1.handleSpawnOutputArray([
        cp.stdout.toString(),
        cp2.stdout.toString(),
    ].join('\n'), s => {
        return s.replace(/^\s+\d+(\.\d+)%\s+/, '');
    });
}
exports.gitDiffStagedDir = gitDiffStagedDir;
function gitDiffStagedFile(git_root, options) {
    git_root = root_1.hasGit(git_root);
    const { bin = 'git' } = (options || {});
    let cp = git_1.crossSpawnSync(bin, 'diff --cached --name-only --relative'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    let cp2 = git_1.crossSpawnSync(bin, 'diff --name-only --relative'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    return data_1.handleSpawnOutputArray([
        cp.stdout.toString(),
        cp2.stdout.toString(),
    ].join('\n'));
}
exports.gitDiffStagedFile = gitDiffStagedFile;
exports.default = gitDiffStagedFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsa0RBQTBEO0FBQzFELG9EQUFtRTtBQUNuRSx5Q0FBd0M7QUFPeEMsU0FBZ0IsYUFBYSxDQUFDLFFBQWdCLEVBQUUsT0FBa0I7SUFFakUsUUFBUSxHQUFHLGFBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUU1QixNQUFNLEVBQUUsR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFHLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRXhDLElBQUksRUFBRSxHQUFHLG9CQUFjLENBQUMsR0FBRyxFQUFFLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNwRSxHQUFHLEVBQUUsUUFBUTtRQUNiLFNBQVMsRUFBRSxJQUFJO0tBQ2YsQ0FBQyxDQUFDO0lBRUgsT0FBTyw2QkFBc0IsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDckQsQ0FBQztBQVpELHNDQVlDO0FBRUQsU0FBZ0IsZ0JBQWdCLENBQUMsUUFBZ0IsRUFBRSxPQUFrQjtJQUVwRSxRQUFRLEdBQUcsYUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTVCLE1BQU0sRUFBRSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQUcsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7SUFFeEMsSUFBSSxFQUFFLEdBQUcsb0JBQWMsQ0FBQyxHQUFHLEVBQzFCLGlDQUFpQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFDNUM7UUFDQyxHQUFHLEVBQUUsUUFBUTtRQUNiLFNBQVMsRUFBRSxJQUFJO0tBQ2YsQ0FDRCxDQUFDO0lBRUYsSUFBSSxHQUFHLEdBQUcsb0JBQWMsQ0FBQyxHQUFHLEVBQzNCLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFDbkM7UUFDQyxHQUFHLEVBQUUsUUFBUTtRQUNiLFNBQVMsRUFBRSxJQUFJO0tBQ2YsQ0FDRCxDQUFDO0lBRUYsT0FBTyw2QkFBc0IsQ0FBQztRQUM3QixFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNwQixHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtLQUNyQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtRQUVqQixPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDM0MsQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDO0FBN0JELDRDQTZCQztBQUVELFNBQWdCLGlCQUFpQixDQUFDLFFBQWdCLEVBQUUsT0FBa0I7SUFFckUsUUFBUSxHQUFHLGFBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUU1QixNQUFNLEVBQUUsR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFHLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRXhDLElBQUksRUFBRSxHQUFHLG9CQUFjLENBQUMsR0FBRyxFQUMxQixzQ0FBc0MsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQ2pEO1FBQ0MsR0FBRyxFQUFFLFFBQVE7UUFDYixTQUFTLEVBQUUsSUFBSTtLQUNmLENBQ0QsQ0FBQztJQUVGLElBQUksR0FBRyxHQUFHLG9CQUFjLENBQUMsR0FBRyxFQUMzQiw2QkFBNkIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQ3hDO1FBQ0MsR0FBRyxFQUFFLFFBQVE7UUFDYixTQUFTLEVBQUUsSUFBSTtLQUNmLENBQ0QsQ0FBQztJQUVGLE9BQU8sNkJBQXNCLENBQUM7UUFDN0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDcEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7S0FDckIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNmLENBQUM7QUExQkQsOENBMEJDO0FBRUQsa0JBQWUsaUJBQWlCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDE5LzYvMTMuXG4gKi9cblxuaW1wb3J0IHsgY3Jvc3NTcGF3blN5bmMgfSBmcm9tICdAZ2l0LWxhenkvdXRpbC9zcGF3bi9naXQnO1xuaW1wb3J0IHsgaGFuZGxlU3Bhd25PdXRwdXRBcnJheSB9IGZyb20gJ0BnaXQtbGF6eS91dGlsL3NwYXduL2RhdGEnO1xuaW1wb3J0IHsgaGFzR2l0IH0gZnJvbSAnQGdpdC1sYXp5L3Jvb3QnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElPcHRpb25zXG57XG5cdGJpbj86IHN0cmluZ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2l0RGlmZlN0YWdlZChnaXRfcm9vdDogc3RyaW5nLCBvcHRpb25zPzogSU9wdGlvbnMpOiBzdHJpbmdbXVxue1xuXHRnaXRfcm9vdCA9IGhhc0dpdChnaXRfcm9vdCk7XG5cblx0Y29uc3QgeyBiaW4gPSAnZ2l0JyB9ID0gKG9wdGlvbnMgfHwge30pO1xuXG5cdGxldCBjcCA9IGNyb3NzU3Bhd25TeW5jKGJpbiwgJ2RpZmYgLS1jYWNoZWQgLS1uYW1lLW9ubHknLnNwbGl0KCcgJyksIHtcblx0XHRjd2Q6IGdpdF9yb290LFxuXHRcdHN0cmlwQW5zaTogdHJ1ZSxcblx0fSk7XG5cblx0cmV0dXJuIGhhbmRsZVNwYXduT3V0cHV0QXJyYXkoY3Auc3Rkb3V0LnRvU3RyaW5nKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2l0RGlmZlN0YWdlZERpcihnaXRfcm9vdDogc3RyaW5nLCBvcHRpb25zPzogSU9wdGlvbnMpOiBzdHJpbmdbXVxue1xuXHRnaXRfcm9vdCA9IGhhc0dpdChnaXRfcm9vdCk7XG5cblx0Y29uc3QgeyBiaW4gPSAnZ2l0JyB9ID0gKG9wdGlvbnMgfHwge30pO1xuXG5cdGxldCBjcCA9IGNyb3NzU3Bhd25TeW5jKGJpbixcblx0XHQnZGlmZiAtLWNhY2hlZCAtLWRpcnN0YXQ9ZmlsZXMsMCcuc3BsaXQoJyAnKSxcblx0XHR7XG5cdFx0XHRjd2Q6IGdpdF9yb290LFxuXHRcdFx0c3RyaXBBbnNpOiB0cnVlLFxuXHRcdH0sXG5cdCk7XG5cblx0bGV0IGNwMiA9IGNyb3NzU3Bhd25TeW5jKGJpbixcblx0XHQnZGlmZiAtLWRpcnN0YXQ9ZmlsZXMsMCcuc3BsaXQoJyAnKSxcblx0XHR7XG5cdFx0XHRjd2Q6IGdpdF9yb290LFxuXHRcdFx0c3RyaXBBbnNpOiB0cnVlLFxuXHRcdH0sXG5cdCk7XG5cblx0cmV0dXJuIGhhbmRsZVNwYXduT3V0cHV0QXJyYXkoW1xuXHRcdGNwLnN0ZG91dC50b1N0cmluZygpLFxuXHRcdGNwMi5zdGRvdXQudG9TdHJpbmcoKSxcblx0XS5qb2luKCdcXG4nKSwgcyA9PlxuXHR7XG5cdFx0cmV0dXJuIHMucmVwbGFjZSgvXlxccytcXGQrKFxcLlxcZCspJVxccysvLCAnJylcblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnaXREaWZmU3RhZ2VkRmlsZShnaXRfcm9vdDogc3RyaW5nLCBvcHRpb25zPzogSU9wdGlvbnMpOiBzdHJpbmdbXVxue1xuXHRnaXRfcm9vdCA9IGhhc0dpdChnaXRfcm9vdCk7XG5cblx0Y29uc3QgeyBiaW4gPSAnZ2l0JyB9ID0gKG9wdGlvbnMgfHwge30pO1xuXG5cdGxldCBjcCA9IGNyb3NzU3Bhd25TeW5jKGJpbixcblx0XHQnZGlmZiAtLWNhY2hlZCAtLW5hbWUtb25seSAtLXJlbGF0aXZlJy5zcGxpdCgnICcpLFxuXHRcdHtcblx0XHRcdGN3ZDogZ2l0X3Jvb3QsXG5cdFx0XHRzdHJpcEFuc2k6IHRydWUsXG5cdFx0fSxcblx0KTtcblxuXHRsZXQgY3AyID0gY3Jvc3NTcGF3blN5bmMoYmluLFxuXHRcdCdkaWZmIC0tbmFtZS1vbmx5IC0tcmVsYXRpdmUnLnNwbGl0KCcgJyksXG5cdFx0e1xuXHRcdFx0Y3dkOiBnaXRfcm9vdCxcblx0XHRcdHN0cmlwQW5zaTogdHJ1ZSxcblx0XHR9LFxuXHQpO1xuXG5cdHJldHVybiBoYW5kbGVTcGF3bk91dHB1dEFycmF5KFtcblx0XHRjcC5zdGRvdXQudG9TdHJpbmcoKSxcblx0XHRjcDIuc3Rkb3V0LnRvU3RyaW5nKCksXG5cdF0uam9pbignXFxuJykpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnaXREaWZmU3RhZ2VkRmlsZVxuIl19