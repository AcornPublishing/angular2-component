/* */ 
"format cjs";
import { ExpandOperator } from './expand-support';
export function expand(project, concurrent = Number.POSITIVE_INFINITY, scheduler = undefined) {
    concurrent = (concurrent || 0) < 1 ? Number.POSITIVE_INFINITY : concurrent;
    return this.lift(new ExpandOperator(project, concurrent, scheduler));
}
//# sourceMappingURL=expand.js.map