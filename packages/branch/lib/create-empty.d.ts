/**
 * Created by user on 2019/3/10.
 */
/**
 * 建立空白分支
 */
export declare function createEmptyBranch(new_name: string, options?: createEmptyBranch.IOptions): string;
export declare namespace createEmptyBranch {
    interface IOptions {
        /**
         * 要建立空白分支的 git repo 路徑，只允許根目錄
         */
        cwd?: string;
        /**
         * 清理檔案的模式
         */
        mode?: EnumMode;
        /**
         * 設定 commit 的 訊息
         */
        msg?: string;
        /**
         * 設定 commit 的 author
         */
        author?: string;
    }
    const enum EnumMode {
        /**
         * 預設模式 比較快 不移除檔案 只操作 GIT 紀錄
         */
        ORPHAN = 0,
        /**
         * 會移除檔案
         */
        ORPHAN_RM = 1,
        /**
         * 會強制移除檔案
         */
        ORPHAN_RM_FORCE = 2
    }
}
export default createEmptyBranch;
