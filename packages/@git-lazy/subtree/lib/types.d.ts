/**
 * Created by user on 2020/6/5.
 */
import { ITSRequireAtLeastOne } from 'ts-type';
export declare type IOptions = {
    prefix: string;
    cwd?: string;
    branch?: string;
    squash?: boolean;
} & ITSRequireAtLeastOne<{
    remote: string;
    name?: string;
}>;
export interface IOptionsRuntime {
    options: IOptions;
    cwd: string;
    root: string;
    remote: string;
    branch: string;
    prefixType: EnumPrefixType;
    prefix: string;
    prefixPath: string;
}
export declare enum EnumPrefixType {
    ROOT = 0,
    RELATIVE = 1,
    ABSOLUTE = 2
}
export declare enum EnumSubtreeCmd {
    add = "add",
    push = "push",
    pull = "pull"
}
