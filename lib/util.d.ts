/**
 * Created by user on 2019/1/6/006.
 */
/// <reference types="node" />
import { ICommands, IOptions, IParseCommit, IReturnCommits } from './type';
export declare const debug: any;
export declare function handleOptions(options: IOptions): IOptions;
export declare function buildCommands(options: IOptions): {
    bin: string;
    commands: ICommands;
};
export declare function decode(file: string): string;
/***
 Add optional parameter to command
 */
export declare function addOptional(commands: ICommands, options: IOptions): (string | number)[];
export declare function parseCommits(commits: string[], options: IOptions): IReturnCommits;
export declare function parseCommitsStdout(options: IOptions, stdout: Buffer): IParseCommit[];
export interface IAsyncCallback {
    (error: any, commits: IReturnCommits): void;
}
