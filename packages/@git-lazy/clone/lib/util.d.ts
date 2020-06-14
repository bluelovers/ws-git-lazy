/**
 * Created by user on 2020/6/15.
 */
import { IOptionsGitClone, IOptionsGitCloneSync } from './types';
export declare function handleOptions<T extends IOptionsGitClone | IOptionsGitCloneSync>(remote: string, options?: T): {
    remote: string;
    options: T;
};
export declare function gitCloneCmd(remote: string, options?: IOptionsGitClone): string[];
