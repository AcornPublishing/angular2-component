/* */ 
"format cjs";
import { FindValueOperator } from './find-support';
export function findIndex(predicate, thisArg) {
    return this.lift(new FindValueOperator(predicate, this, true, thisArg));
}
//# sourceMappingURL=findIndex.js.map