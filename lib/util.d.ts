/**
 * Created by user on 2019/1/6/006.
 */
/// <reference types="node" />
import debug0 = require('debug');
import { EnumPrettyFormatFlags, ICommands, IFieldsArray, IOptions, IParseCommit, IReturnCommits } from './type';
export declare const debug: debug0.IDebugger;
export declare function handleOptions(options: IOptions): IOptions;
export declare function buildCommands(options: IOptions): {
    bin: string;
    commands: ICommands;
};
export declare function addPrettyFormat(commands: ICommands, options: IOptions, flagName?: EnumPrettyFormatFlags): (string | number)[];
export declare function decode(file: string): string;
export declare function decamelize(key: string): string;
export declare function toFlag(key: string): string;
export declare function addFlagsBool(commands: ICommands, options: IOptions, flagNames: string[]): (string | number)[];
/***
 Add optional parameter to command
 */
export declare function addOptional(commands: ICommands, options: IOptions): (string | number)[];
export declare function parseCommitFields(parsed: IParseCommit, commitField: string, index: number, fields: IFieldsArray): IParseCommit;
export declare function parseCommits(commits: string[], options: IOptions): IReturnCommits;
export declare function parseCommitsStdout(options: IOptions, stdout: Buffer): IReturnCommits;
export interface IAsyncCallback<E = ReturnType<typeof createError>> {
    (error: E, commits: IReturnCommits): void;
    (error: never, commits: IReturnCommits): void;
}
export declare function createError<D extends any, E extends Error>(message?: any, data?: D, err?: {
    new (): E;
    new (...argv: any[]): E;
}): E & {
    data: D;
};
