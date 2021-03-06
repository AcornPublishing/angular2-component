/* */ 
"format cjs";
import { ReduceOperator } from './reduce-support';
export function min(comparer) {
    const min = (typeof comparer === 'function')
        ? comparer
        : (x, y) => x < y ? x : y;
    return this.lift(new ReduceOperator(min));
}
//# sourceMappingURL=min.js.map