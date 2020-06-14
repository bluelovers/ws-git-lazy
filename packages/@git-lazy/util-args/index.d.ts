export declare function kebabCaseObject<T extends Record<string, any>>(data: Record<string, any>): T;
export declare function lazyUnParse(data: Record<string, any>, options?: {
    noKebabCase?: boolean;
}): string[];
export default lazyUnParse;
