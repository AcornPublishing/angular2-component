/* */ 
"format cjs";
import { MergeAllOperator } from './mergeAll-support';
export function mergeAll(concurrent = Number.POSITIVE_INFINITY) {
    return this.lift(new MergeAllOperator(concurrent));
}
//# sourceMappingURL=mergeAll.js.map