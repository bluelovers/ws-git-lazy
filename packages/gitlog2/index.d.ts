import { defaultOptions, EnumGitDateFormat, EnumGitDateFormat as _EnumGitDateFormat, IOptions, IOptionsGitFlogs, IOptionsGitWithValue, IOptionsGitFlogsExtra, IParseCommit, IReturnCommits, IFieldsArray, defaultFields } from './lib/type';
import { IAsyncCallback } from './lib/util';
import Bluebird from 'bluebird';
export { EnumGitDateFormat, IReturnCommits, IParseCommit, IFieldsArray, defaultFields, defaultOptions };
export { IOptions, IOptionsGitFlogs, IOptionsGitWithValue, IOptionsGitFlogsExtra, };
export declare function gitlog(options: IOptions): IParseCommit[];
export declare namespace gitlog {
    var gitlog: typeof import(".").gitlog;
    var default: typeof import(".").gitlog;
}
export declare function gitlog(options: IOptions, cb: IAsyncCallback): Bluebird<IParseCommit[]>;
export declare namespace gitlog {
    var gitlog: typeof import(".").gitlog;
    var default: typeof import(".").gitlog;
}
export declare function gitlog(options: IOptions, cb?: IAsyncCallback): IParseCommit[] | Bluebird<IParseCommit[]>;
export declare namespace gitlog {
    var gitlog: typeof import(".").gitlog;
    var default: typeof import(".").gitlog;
}
export declare namespace gitlog {
    /**
     * this method can make sure u are use sync mode
     */
    function sync(options: IOptions): IParseCommit[];
    /**
     * allow `await` when use `callback` mode,
     * but remember u can't change `return value` when use `callback`
     */
    function asyncCallback(options: IOptions, cb: IAsyncCallback): Bluebird<IParseCommit[]>;
    /**
     * async Promise mode
     */
    function async(options: IOptions): Bluebird<IParseCommit[]>;
    const EnumGitDateFormat: typeof _EnumGitDateFormat;
}
export import sync = gitlog.sync;
export import asyncCallback = gitlog.asyncCallback;
export import async = gitlog.async;
export default gitlog;
