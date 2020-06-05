/**
 * Created by user on 2020/6/5.
 */
import { EnumPrefixType } from './types';
export declare function handlePrefix(prefix: string): {
    prefixType: EnumPrefixType;
    prefix: string;
};
export declare function inSubPath(sub: string, root: string): boolean;
