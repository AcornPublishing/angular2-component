/* */ 
"format cjs";
import { ReduceOperator } from './reduce-support';
export function reduce(project, seed) {
    return this.lift(new ReduceOperator(project, seed));
}
//# sourceMappingURL=reduce.js.map