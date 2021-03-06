/* */ 
"format cjs";
import { MergeMapOperator } from './mergeMap-support';
export function mergeMap(project, resultSelector, concurrent = Number.POSITIVE_INFINITY) {
    return this.lift(new MergeMapOperator(project, resultSelector, concurrent));
}
//# sourceMappingURL=mergeMap.js.map