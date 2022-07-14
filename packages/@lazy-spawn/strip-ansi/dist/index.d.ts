export declare function stripAnsiValue(input: Buffer, toStr: true): string;
export declare function stripAnsiValue(input: Buffer, toStr?: boolean): Buffer;
export declare function stripAnsiValue(input: string, toStr?: boolean): string;
export declare function stripAnsiValue<T>(input: T, toStr: true): string;
export declare function stripAnsiValue<T>(input: T, toStr?: boolean): T;
export default stripAnsiValue;

export {};
