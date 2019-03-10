/**
 * Created by user on 2019/3/10.
 */
export declare function renameRemoteBranch(remote: string, old_name: string, new_name: string, options?: renameRemoteBranch.IOptions): boolean;
export declare namespace renameRemoteBranch {
    interface IOptions {
        /**
         * 要建立空白分支的 git repo 路徑，只允許根目錄
         */
        cwd?: string;
    }
}
export default renameRemoteBranch;
