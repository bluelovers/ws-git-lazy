/**
 * Created by user on 2020/6/5.
 */
import { EnumPrefixType, IOptionsHandlePrefixPath, IReturnTypeHandlePrefixPath } from './types';
export declare function handlePrefix(prefix: string): {
    prefixType: EnumPrefixType;
    prefix: string;
};
export declare function inSubPath(sub: string, root: string): boolean;
export declare function handlePrefixPath(options: IOptionsHandlePrefixPath): IReturnTypeHandlePrefixPath;
export declare function assertString(value: any, name?: string): asserts value is string;
