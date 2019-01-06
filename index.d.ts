import { defaultOptions, EnumGitDateFormat, IOptions, IParseCommit, IReturnCommits, IFieldsArray, defaultFields } from './lib/type';
import { IAsyncCallback } from './lib/util';
import Bluebird = require('bluebird');
export { EnumGitDateFormat, IReturnCommits, IParseCommit, IOptions, IFieldsArray, defaultFields, defaultOptions };
export declare function gitlog(options: IOptions, cb?: IAsyncCallback): IParseCommit[] | Bluebird<IParseCommit[]>;
export declare namespace gitlog {
    var gitlog: typeof gitlog;
    var default: typeof gitlog;
}
export declare namespace gitlog {
    function sync(options: IOptions): IParseCommit[] | Bluebird<IParseCommit[]>;
    function asyncCallback(options: IOptions, cb: IAsyncCallback): void;
    function async(options: IOptions): Promise<IParseCommit[]>;
}
export import sync = gitlog.sync;
export import asyncCallback = gitlog.asyncCallback;
export import async = gitlog.async;
export default gitlog;
