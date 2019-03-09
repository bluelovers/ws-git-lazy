/**
 * Created by user on 2019/3/10.
 */
export declare function createEmptyBranch(old_name: string, new_name: string, options?: createEmptyBranch.IOptions): string;
export declare namespace createEmptyBranch {
    interface IOptions {
        cwd?: string;
        mode?: EnumMode;
        msg?: string;
        author?: string;
    }
    enum EnumMode {
        ORPHAN = 0,
        ORPHAN_RM = 1
    }
}
export default createEmptyBranch;
