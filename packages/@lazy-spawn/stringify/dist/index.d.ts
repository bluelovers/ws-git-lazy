import { SpawnSyncReturns } from 'cross-spawn-extra/core';
import { ITSValueOrArray } from 'ts-type/lib/type/base';

export declare function crossSpawnOutput(buf: SpawnSyncReturns["output"] | ITSValueOrArray<Buffer | string>, options?: {
	clearEol?: boolean;
	stripAnsi?: boolean;
}): string;
export default crossSpawnOutput;

export {};
