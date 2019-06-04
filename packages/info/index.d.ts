/**
 * Created by user on 2019/6/4.
 */
export declare function findConfigPathLocal(cwd?: string): string;
export declare function parseConfig(file: string): {
    core?: {
        repositoryformatversion?: number;
        filemode?: boolean;
        bare?: boolean;
        logallrefupdates?: boolean;
        symlinks?: boolean;
        ignorecase?: boolean;
        [k: string]: unknown;
    };
    remote?: Record<string | 'origin', {
        url?: string;
        fetch?: string;
        [k: string]: unknown;
    }>;
    branch?: Record<string | 'master', {
        remote?: 'origin' | string;
        merge?: string;
        [k: string]: unknown;
    }>;
};
export declare function filterRemoteUrl(o: ReturnType<typeof parseConfig>): string;
export default findConfigPathLocal;
